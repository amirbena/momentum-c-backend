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
  async sheets() {
    return await this.googleService.readSheetFile(SHEETS_CONTANT);
  }

}
