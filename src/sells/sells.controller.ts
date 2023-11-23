import { Body, Controller, Post, UseGuards, } from '@nestjs/common';
import { SellsService } from './sells.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { TokenDto } from 'src/dto/request/users/tokenDto.dto';
import { SellsInstanceDto } from 'src/dto/request/sells/SellIntance.dto';
import { GetSellsDto } from 'src/dto/request/sells/getSells.dto';

@Controller('sells')
export class SellsController {
    constructor(private sellsService: SellsService) { }

    @Post()
    @UseGuards(AuthGuard)
    async getSells(@Body() getSells: GetSellsDto): Promise<SellsInstanceDto> {
        return await this.sellsService.getSellsByUser(getSells.user);
    }
}
