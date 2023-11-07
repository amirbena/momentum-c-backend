import { Module } from '@nestjs/common';
import { PopupService } from './popup.service';
import { PopupController } from './popup.controller';

@Module({
  providers: [PopupService],
  controllers: [PopupController]
})
export class PopupModule {}
