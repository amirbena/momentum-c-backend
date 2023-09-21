import { Injectable, StreamableFile } from '@nestjs/common';
import { google, drive_v3, sheets_v4 } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { createReadStream } from 'fs';
import { FOLDER_MEDIA_TYPE_DRIVE, FOLDER_TO_ADD } from 'src/constants/constants';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';


@Injectable()
export class GoogleService {

    private drive: drive_v3.Drive;
    private sheets: sheets_v4.Sheets;

    constructor(@InjectRedis() private readonly redis: Redis) {
        const googleOAuth2 = new google.auth.OAuth2(
            process.env.GOOGLE_OAUTH2_CLIENT_ID,
            process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
            process.env.GOOGLE_OAUTH2_GOOGLE_OAUTH2_REDIRECT_URI
        );
        googleOAuth2.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH2_REFRESH_TOKEN })
        this.drive = google.drive({
            version: 'v3',
            auth: googleOAuth2,
        })

        this.sheets = google.sheets({
            version: 'v4',
            auth: googleOAuth2
        })
    }


    async createFolder(folderName: string) {
        let result = await this.drive.files.list({
            q: `mimeType='${FOLDER_MEDIA_TYPE_DRIVE}' and trashed=false`,
            fields: '*',
            spaces: 'drive',
        });


        const item = result.data.files.find(check => check.name === FOLDER_TO_ADD);

        const { id } = item;

        const folder = await this.drive.files.create({
            requestBody: {
                mimeType: FOLDER_MEDIA_TYPE_DRIVE,
                parents: [id],
                name: folderName

            }
        })

        await this.redis.set("Item", folder.data.id);
        return folder.data;

    }

    async readSheetFile(spreadsheetId: string) {
       return await this.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'A5:D82'
        });
    }
}
