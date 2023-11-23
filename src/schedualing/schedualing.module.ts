import { Module } from '@nestjs/common';
import { SchedualingService } from './schedualing.service';
import { SellsModule } from 'src/sells/sells.module';
import { UsersService } from 'src/users/users.service';
import { GoogleService } from 'src/google/google.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [SellsModule, UsersModule],
  providers: [GoogleService, SchedualingService]

})
export class SchedualingModule { }
