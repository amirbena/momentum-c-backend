import { Injectable, StreamableFile } from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { createReadStream } from 'fs';
import { FOLDER_MEDIA_TYPE_DRIVE, FOLDER_TO_ADD } from 'src/constants/constants';


@Injectable()
export class GoogleService {

    private drive: drive_v3.Drive;

    constructor() {
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
    }


    async createFolder(folderName: string) {
        let result = await this.drive.files.list({
            q: `mimeType='${FOLDER_MEDIA_TYPE_DRIVE}' and trashed=false`,
            fields: '*',
            spaces: 'drive',
        });


        const item = result.data.files.find(check => check.name === FOLDER_TO_ADD);

        const folder = await this.drive.files.create({
            requestBody: {
                mimeType: FOLDER_MEDIA_TYPE_DRIVE,
                parents: [item.id],
                name: folderName

            }
        })
        return folder.data;
    }

    async readSheetFile(){
        
    }
}
