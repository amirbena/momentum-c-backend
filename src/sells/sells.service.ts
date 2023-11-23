import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SellsInstanceDto } from 'src/dto/request/sells/SellIntance.dto';
import { TokenDto } from 'src/dto/request/users/tokenDto.dto';
import { Sells, SellsDocument } from 'src/schemas/sells.schema';
import { UsersService } from 'src/users/users.service';
import { Utils } from 'src/utils/Utils';

@Injectable()
export class SellsService {

    constructor(@InjectModel(Sells.name) private sellsModel: Model<Sells>, private userService: UsersService) { }

    async createSellsInstance(sellsInstanceDto: SellsInstanceDto) {
        Logger.log(`SellsService->createSellsInstance() Entered`)
        const sells = new this.sellsModel(sellsInstanceDto);
        await sells.save();
        return sells;
    }

    async getSellsByUser(tokenDto: TokenDto): Promise<SellsInstanceDto> {
        try {
            const creationDate = new Date();
            const { dateBefore, dateAfter } = Utils.buildDateRangeOfDate(creationDate);
            const result = await this.sellsModel.find({ fullName: tokenDto.fullName, $or: [{ creationDate: { $gte: dateBefore, $lte: dateAfter } }] });
            if (!result.length) {
                return {
                    creationDate: new Date(),
                    fullName: tokenDto.fullName,
                    newProducts: [],
                    sellsToday: [],
                    totalSells: 0
                }
            }

            return result[0];

        } catch (ex) {
            Logger.warn(`SellsService->instanceFailure() an error occured`);
            return {
                creationDate: new Date(),
                fullName: "",
                newProducts: [],
                sellsToday: [],
                totalSells: 0
            } 
        }
    }
}
