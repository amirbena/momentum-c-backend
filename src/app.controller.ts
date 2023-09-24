import { Controller, Get, Post, Body, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { GoogleService } from './google/google.service';
import { SHEETS_CONTANT } from './constants/constants';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly googleService: GoogleService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }


  @Post('/uploadFolder')
  async createFolder(@Body() check: Record<any, string>) {
    Logger.log('folderName', check);
    return await this.googleService.createFolder(check.folderName);
  }

  @Post('/readSheet')
  async sheets() {
    return await this.googleService.readSheetFile(SHEETS_CONTANT);
  }

}
