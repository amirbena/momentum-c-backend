import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { GoogleService } from './google/google.service';
import { MOMENTUM_MAIL_EMAIL, SHEETS_CONTANT } from './constants/constants';
import { MailService } from './mail/mail.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly googleService: GoogleService, private mailService: MailService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health')
  getInfo(): string {
    return "Hello";
  }

  @Get('/info')
  getHealth(): string {
    return "Health";
  }

  @Get('/etsy')
  async getEtsyData() {
    return await this.googleService.accessEtsyDrives();
  }
  @Post('/readSheet')
  async sheets(@Body() sheetBody: Record<string, string>) {
    return await this.googleService.readSheetFile(sheetBody.sheetId);
  }

  @Post('/specificSheet')
  async ReadSheetFile(@Body() sheet: Record<string, any>) {
    return await this.googleService.getIsHasApplicationByOrder(sheet.folderId);
  }

  @Post('/sheetsFolder')
  async check(@Body() folder: Record<string, any>) {
    return await this.googleService.getSheetsFiles(folder.folderId);
  }

  @Post('/sendMail')
  async sendMail() {
    return await this.mailService.sendEmail({
      from: MOMENTUM_MAIL_EMAIL,
      to: "amir12061968@gmail.com",
      subject: "CHECK",
      html: "<h1> success</h1>"
    })
  }

}
