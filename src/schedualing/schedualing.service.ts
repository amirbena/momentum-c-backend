import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { drive_v3 } from 'googleapis';
import { IsHasApplication } from 'src/dto/request/sells/isHasApplication';
import { Product } from 'src/dto/schema/product';
import { GoogleService } from 'src/google/google.service';
import { SellsService } from 'src/sells/sells.service';
import { UsersService } from 'src/users/users.service';
import translate from 'google-translate-api-x';

@Injectable()
export class SchedualingService {

    constructor(private googleService: GoogleService, private sellsService: SellsService, private usersService: UsersService) { }

    @Cron('0 3 * * *')
    async handleSellsUpdate() {
        const etsyDrives = await this.getEtsyDriveFiles();
        let filters = await Promise.all(this.filterHasApplicationFolder(etsyDrives));
        filters = filters.filter(filter => !filter.folderId || !filter.files.length);
        let sheetFiles = await Promise.all(this.getSheetsFiles(filters));
        sheetFiles = sheetFiles.filter(sheetFile => !sheetFile.sheets.files.length);
        const sheetFilesResults = await Promise.all(this.readSheetsFiles(sheetFiles));
        await this.createSellsReleaseActions(sheetFilesResults);
    }

    private async getEtsyDriveFiles(): Promise<drive_v3.Schema$File[]> {
        try {
            const drive = await this.googleService.accessEtsyDrives();
            return drive.files
        } catch (error) {
            return []
        }
    }

    private filterHasApplicationFolder(files: drive_v3.Schema$File[]): Promise<IsHasApplication>[] {
        return files.map(async file => {
            const id = file.id
            const name = file.name;
            if (!id) {
                return {
                    folderId: id,
                    name,
                    files: []
                } as IsHasApplication
            }
            const filesList = await this.googleService.getIsHasApplicationByOrder(id);
            return {
                folderId: id,
                name,
                files: filesList.files
            } as IsHasApplication
        });
    }

    private getSheetsFiles(applicationArray: IsHasApplication[]): Promise<IsHasApplication>[] {
        return applicationArray.map(async application => {
            const { files: [isApplication] } = application;
            const { id } = isApplication;
            if (!id) {
                return {
                    ...application,
                    sheets: { files: [] }
                }
            }
            const sheets = await this.googleService.getSheetsFiles(id);
            return {
                ...application,
                sheets
            }
        });
    }

    private readSheetsFiles(sheetsArray: IsHasApplication[]): Promise<IsHasApplication>[] {
        return sheetsArray.map(async application => {
            const { sheets: { files } } = application;
            let orderSheetId: string;
            let listingResearchId: string;
            let listingResearchValues: any[];
            let orderSheetValues: any[];

            const orderSheet = files.find(file => file.name.includes("Order Sheet"))
            orderSheetId = orderSheet.id;
            const orderSheetReadResult = await this.googleService.readSheetFile(orderSheetId)
            orderSheetValues = orderSheetReadResult.data.values || [];

            const listingResearch = files.find(file => file.name.includes("Listing_Research"));
            listingResearchId = listingResearch.id;
            const listingReasearchResult = await this.googleService.readSheetFile(listingResearchId)
            listingResearchValues = listingReasearchResult.data.values || [];

            return {
                ...application,
                orderSheetId,
                orderSheetValues,
                listingResearchId,
                listingResearchValues
            }
        });
    }

    private getProductName(name: string): string {
        const splitted = name.split('/')
        const lastItem = splitted[splitted.length - 1];
        let items = lastItem.split("-");
        items = items.filter(item => !isNaN(Number(item)));
        return items.join(" ");
    }

    private handlingListingResearchResult(sheetFileResult: IsHasApplication): Product[] {
        const products: Product[] = []
        const { listingResearchValues } = sheetFileResult;
        listingResearchValues.forEach((listingResearchValue, index) => {
            if (index % 2 == 0) {
                const sku = listingResearchValue[1] as string;
                const name = this.getProductName(listingResearchValue[3]);
                const price = listingResearchValue[5] as string;
                if (!products.find(product => product.name === name) && sku && price) {
                    products.push({
                        sku,
                        name,
                        price
                    })
                }
            }

        })
        return products.reverse();
    }

    private handlingOrderList(creationDate: Date, sheetFileResult: IsHasApplication): Product[] {
        const products: Product[] = [];
        const dateToCheckFormat = `${creationDate.getMonth() + 1}/${creationDate.getDate()}/${creationDate.getFullYear()}`
        const { orderSheetValues } = sheetFileResult;
        orderSheetValues.forEach((orderSheetValue) => {
            const date = orderSheetValue[1];
            if (date && dateToCheckFormat === date) {
                const sku = orderSheetValue[2];
                const name = "";
                const price = orderSheetValue[4];
                if (price && sku) {
                    products.push({
                        sku,
                        name,
                        price
                    })
                }
            }
        })
        return products;
    }

    private putNameInOrderList(orderList: Product[], listingResearch: Product[]): void {
        for (let index = 0; index < orderList.length; index++) {
            const element = orderList[index];
            const itemFound = listingResearch.find(research => research.name === element.name);
            if (itemFound) {
                orderList[index] = {
                    ...orderList[index],
                    name: itemFound.name
                }
            }
        }
    }

    private createTotalSelles(sellsToday: Product[]) {
        let item = 0;
        for (let index = 0; index < sellsToday.length; index++) {
            const element = sellsToday[index].price;
            item += parseInt(element.split(" ")[0]);
        }
        return item;
    }

    private async createSellsReleaseActions(sheetFilesResults: IsHasApplication[]): Promise<void> {

        const result = sheetFilesResults.forEach(async sheetFilesResult => {
            let { name } = sheetFilesResult;
            const creationDate = new Date();
            const newProducts = this.handlingListingResearchResult(sheetFilesResult);
            const sellsToday = this.handlingOrderList(creationDate, sheetFilesResult);
            this.putNameInOrderList(sellsToday, newProducts);

            const totalSells = this.createTotalSelles(sellsToday);

            name = name.split(`'`)[0];
            const translatedToHebrew = await translate(name, { from: 'en', to: 'he' })
            const hebrewText = translatedToHebrew.text;
            const itemCheckedHebrew = await this.usersService.checkNameUserExist(hebrewText);
            if (itemCheckedHebrew) {
                await this.sellsService.createSellsInstance({
                    creationDate,
                    newProducts,
                    sellsToday, totalSells,
                    fullName: itemCheckedHebrew
                });
                return;
            }

            const english = await this.usersService.checkNameUserExist(name);
            if(english){
                await this.sellsService.createSellsInstance({
                    creationDate,
                    newProducts,
                    sellsToday, totalSells,
                    fullName: english
                });
            }

        })
    }
}
