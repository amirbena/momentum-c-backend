import { authenticate } from '@google-cloud/local-auth';
import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { google, drive_v3, sheets_v4 } from 'googleapis';
import { join } from 'path';
import { REDIRECT_URI, SHEETS_DRIVE_CLIENT_ID, SHEETS_DRIVE_CLIENT_SECRET } from 'src/constants/constants';


@Injectable()
export class GoogleService {

    private drive: drive_v3.Drive;
    private sheets: sheets_v4.Sheets;
    private TOKEN_PATH = join(process.cwd(), process.env.NODE_ENV == "production" ? "dist" : "src", "google", 'token.json');
    private CREDENTIALS_PATH = join(process.cwd(), process.env.NODE_ENV == "production" ? "dist" : "src", "google", 'credentials.json');
    private scopes = [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.activity.readonly',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/spreadsheets.readonly'
    ];

    constructor() {

        /* const auth = new google.auth.OAuth2(
            SHEETS_DRIVE_CLIENT_ID,
            SHEETS_DRIVE_CLIENT_SECRET,
            REDIRECT_URI
        );

        this.authorize();

        auth.setCredentials(readFileSync(this.CREDENTIALS_PATH) as Credentials);


        this.drive = google.drive({
            version: 'v3',
            auth,
        });

        this.sheets = google.sheets({
            version: 'v4',
            auth
        }) */
    };

    private loadSavedCredentialsIfExist() {
        try {
            const content = readFileSync(this.TOKEN_PATH);
            const credentials = JSON.parse(content.toString());
            return google.auth.fromJSON(credentials);
        } catch (err) {
            return null;
        }
    }

    private saveCredentials(client) {
        const content = readFileSync(this.CREDENTIALS_PATH);
        const keys = JSON.parse(content.toString());
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        writeFileSync(this.TOKEN_PATH, payload);
    }

    private authorize() {
        let client = this.loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        authenticate({
            scopes: this.scopes,
            keyfilePath: this.CREDENTIALS_PATH,
        }).then(resolvesClient => {
            if (resolvesClient.credentials) {
                this.saveCredentials(client);
            }
            return resolvesClient;
        });

    }

    async accessEtsyDrives() {

        console.log();
        const prompt = await this.drive.files.list({
            pageSize: 5,
            fields: 'files(name, webViewLink)',
            orderBy: 'createdTime desc'
        })

        return prompt;
    }



    async readSheetFile(spreadsheetId: string) {
        return await this.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'A5:D82'
        });
    }
}
