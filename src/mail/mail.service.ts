import { Injectable, Logger } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { MOMENTUM_MAIL_EMAIL, MOMENTUM_MAIL_PASSWORD, MOMENTUM_GMAIL_ACCESS_TOKEN, MOMENTUM_GMAIL_CLIENT_ID, MOMENTUM_GMAIL_CLIENT_SECRET, MOMENTUM_GMAIL_REFRESH_TOKEN, REDIRECT_URI } from 'src/constants/constants';
import { EmailOptions } from './mailOptions.model';
import { Utils } from 'src/utils/Utils';
import { google } from 'googleapis';
import { join } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { authenticate } from '@google-cloud/local-auth';
import { OAuth2Client } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';

@Injectable()
export class MailService {

  private emailTransporter: Transporter;

  private SCOPES = ['https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/gmail.send'];

  private TOKEN_PATH = join(process.cwd(), "src", "mail", 'token.json');
  private CREDENTIALS_PATH = join(process.cwd(), "src", "mail", 'credentials.json');


  constructor() {
    const oauth2Client = new google.auth.OAuth2(
      MOMENTUM_GMAIL_CLIENT_ID,
      MOMENTUM_GMAIL_CLIENT_SECRET,
      REDIRECT_URI
    );

    // Generate an access token and refresh token
    const accessToken = MOMENTUM_GMAIL_ACCESS_TOKEN;
    const refreshToken = MOMENTUM_GMAIL_REFRESH_TOKEN;

    // Set the OAuth2 client credentials
    oauth2Client.setCredentials({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    this.authorize().then(async client => {
      client = client as OAuth2Client;
      const refreshTokenResult = await client.refreshAccessToken();
      this.emailTransporter = createTransport({
        service: 'Gmail',
        auth: {
          type: 'OAuth2',
          user: MOMENTUM_MAIL_EMAIL,
          clientId: MOMENTUM_GMAIL_CLIENT_ID,
          clientSecret: MOMENTUM_GMAIL_CLIENT_SECRET,
          refreshToken: MOMENTUM_GMAIL_REFRESH_TOKEN,
          accessToken: MOMENTUM_GMAIL_ACCESS_TOKEN
        },
      });
    })
  }

  private async loadSavedCredentialsIfExist() {
    try {
      const content = await readFile(this.TOKEN_PATH);
      const credentials = JSON.parse(content.toString());
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  async saveCredentials(client) {
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

  async authorize() {
    let client: JSONClient | OAuth2Client = await this.loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: this.SCOPES,
      keyfilePath: this.CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await this.saveCredentials(client);
    }
    return client;
  }
  async sendEmail(emailOptions: EmailOptions) {
    try {
      Logger.log(`MailService->sendEmail() entered with:  ${Utils.toString(emailOptions)}`);
      const result = await this.emailTransporter.sendMail(emailOptions);
      Logger.log(`MailService->sendEmail() got:  ${Utils.toString(result)}`);
      return result;
    } catch (error) {
      Logger.error(`MailService->sendEmail() an error occured: ${Utils.toString(error)}`);
      throw error;
    }
  }
}
