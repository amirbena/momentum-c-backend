import { Injectable, Logger } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import { EMAIL_ID, EMAIL_PASSWORD } from 'src/constants/constants';
import { EmailOptions } from './mailOptions.model';
import { Utils } from 'src/utils/Utils';

@Injectable()
export class MailService {

    private emailTransporter: Transporter = createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: EMAIL_ID , /* "lwkymmwty28@gmail.com", */ // Your email id
            pass: EMAIL_PASSWORD /* "Moti12345678!" */ // Your password
        }
    });

    constructor() { }

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
