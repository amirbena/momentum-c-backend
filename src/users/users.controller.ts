import { Controller, Post, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post('/')
    @UsePipes(ValidationPipe)
    async register(@Body() user: User) {
        await this.userService.createUser(user);
    }
}
