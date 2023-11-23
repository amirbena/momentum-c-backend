import { authenticate } from '@google-cloud/local-auth';
import { Injectable, Logger, StreamableFile } from '@nestjs/common';
import { readFile, writeFile } from 'fs/promises';
import { Credentials, OAuth2Client } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { google, drive_v3, sheets_v4 } from 'googleapis';
import { join } from 'path';
import { REDIRECT_URI, SHEETS_DRIVE_CLIENT_ID, SHEETS_DRIVE_CLIENT_SECRET } from 'src/constants/constants';


@Injectable()
export class GoogleService {

    private drive: drive_v3.Drive;
    private sheets: sheets_v4.Sheets;
    private TOKEN_PATH = join(process.cwd(), "src", "google", 'token.json');
    private CREDENTIALS_PATH = join(process.cwd(), "src", "google", 'credentials.json');




    private scopes = [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.activity.readonly',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/spreadsheets.readonly'
    ];

    constructor() {

        const auth = new google.auth.OAuth2(
            SHEETS_DRIVE_CLIENT_ID,
            SHEETS_DRIVE_CLIENT_SECRET,
            REDIRECT_URI
        );

        this.authorize().then(client => {
            this.drive = google.drive({
                version: 'v3',
                auth: client as OAuth2Client,
            });

            this.sheets = google.sheets({
                version: 'v4',
                auth: client as OAuth2Client
            })
        })
    };

    private async loadSavedCredentialsIfExist() {
        try {
            const content = await readFile(this.TOKEN_PATH);
            const credentials = JSON.parse(content.toString());
            return google.auth.fromJSON(credentials);
        } catch (err) {
            return null;
        }
    }

    private async saveCredentials(client) {
        const content = await readFile(this.CREDENTIALS_PATH);
        const keys = JSON.parse(content.toString());
        const key = keys.installed || keys.web;
        const payload = JSON.stringify({
            type: 'authorized_user',
            client_id: key.client_id,
            client_secret: key.client_secret,
            refresh_token: client.credentials.refresh_token,
        });
        await writeFile(this.TOKEN_PATH, payload);
    }

    private async authorize() {
        let client: JSONClient | OAuth2Client = await this.loadSavedCredentialsIfExist();
        if (client) {
            return client;
        }
        client = await authenticate({
            scopes: this.scopes,
            keyfilePath: this.CREDENTIALS_PATH,
        });
        if (client.credentials) {
            await this.saveCredentials(client);
        }
        return client;
    }

    async accessEtsyDrives() {
        const etsyFolderId = "1WG6AnKOV6YsNZEz_b9JnpxuhDBOugYeq";
        const prompt = await this.drive.files.list({
            q: `mimeType = 'application/vnd.google-apps.folder' and '${etsyFolderId}' in parents`,
            pageSize: 1000,
            fields: 'files(name, webViewLink,id)',
            orderBy: 'createdTime desc'
        })

        return prompt.data;
    }


    async getIsHasApplicationByOrder(folderId: string) {
        try {
            const prompt = await this.drive.files.list({
                q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.folder'`,
                pageSize: 1000,
                fields: 'files(name, webViewLink,id)',
                orderBy: 'createdTime desc'
            })

            return prompt.data;
        } catch (error) {
            return { files: [] };
        }

    }

    async getSheetsFiles(folderId: string) {
        try {
            const prompt = await this.drive.files.list({
                q: `'${folderId}' in parents and mimeType = 'application/vnd.google-apps.spreadsheet'`,
                pageSize: 1000,
                fields: 'files(name, webViewLink,id)',
                orderBy: 'createdTime desc'
            })
            return prompt.data;
        } catch (error) {
            return { files: [] };
        }

    }



    async readSheetFile(spreadsheetId: string) {
        return await this.sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'A2:Q80'
        });
    }
}
