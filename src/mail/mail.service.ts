import { Injectable, Logger } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { EMAIL_ID, EMAIL_PASSWORD, GMAIL_ACCESS_TOKEN, GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN, REDIRECT_URI } from 'src/constants/constants';
import { EmailOptions } from './mailOptions.model';
import { Utils } from 'src/utils/Utils';
import { google } from 'googleapis';

@Injectable()
export class MailService {

    private emailTransporter: Transporter;

    constructor() { 
        const oauth2Client = new google.auth.OAuth2(
            GMAIL_CLIENT_ID,
            GMAIL_CLIENT_SECRET,
            REDIRECT_URI
          );
          
          // Generate an access token and refresh token
          const accessToken = GMAIL_ACCESS_TOKEN;
          const refreshToken = GMAIL_REFRESH_TOKEN;
          
          // Set the OAuth2 client credentials
          oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          // Create a Nodemailer transporter using OAuth2
          this.emailTransporter = createTransport({
            service: 'Gmail',
            auth: {
              type: 'OAuth2',
              user: EMAIL_ID,
              clientId: GMAIL_CLIENT_ID,
              clientSecret: GMAIL_CLIENT_SECRET,
              refreshToken: refreshToken,
              accessToken: accessToken,
            },
          });
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
