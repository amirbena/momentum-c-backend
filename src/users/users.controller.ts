import { Controller, Post, Body, UsePipes, ValidationPipe, UseGuards, } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from 'src/dto/user.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/guards/roles/roles.decorator';
import { AccessLayer } from 'src/constants/constants';
import { LoginDto } from 'src/dto/login.dto';


@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }



    @Post('/register')
    @UsePipes(ValidationPipe)
    async register(@Body() user: UserDto) {
        return await this.userService.createUser(user);
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    async login(@Body() userlogin: LoginDto){
        return await this.userService.userLogin(userlogin);
    }
}
