import { Controller, Post, Body, UsePipes, ValidationPipe, Logger, Res, Get, UseGuards, Put, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from 'src/dto/request/users/user.dto';
import { LoginDto } from 'src/dto/request/users/login.dto';
import { Response } from 'express';
import { Utils } from 'src/utils/Utils';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { UserDocument } from 'src/schemas/user.schema';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/guards/roles/roles.decorator';
import { AccessLayer } from 'src/constants/constants';
import { UserUpdateDto } from 'src/dto/request/users/userUpdate.dto';
import { Types } from 'mongoose';
import { UserAvailablityDto } from 'src/dto/request/users/changeUserAvailablity.dto';
import { ForgotPasswordDto } from 'src/dto/request/users/forgotPassword.dto';


@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post('/register')
    @UsePipes(ValidationPipe)
    async register(@Body() user: UserDto, @Res({ passthrough: true }) response: Response): Promise<string> {
        Logger.log(`UsersController->register() entered with: ${Utils.toString(user)}`);
        const { message, accessToken } = await this.userService.createUser(user);
        Logger.log(`UsersController->register() got message: ${message}, token: ${accessToken}`);
        response.header("Authorization", `Bearer ${accessToken}`);
        return message;
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    async login(@Body() userlogin: LoginDto, @Res({ passthrough: true }) response: Response): Promise<string> {
        Logger.log(`UsersController->register() entered with: ${Utils.toString(userlogin)}`);
        const { message, accessToken } = await this.userService.userLogin(userlogin);
        Logger.log(`UsersController->register() got message: ${message}, token: ${accessToken}`);
        response.header("Authorization", `Bearer ${accessToken}`);
        return message;
    }

    @Get()
    @UseGuards(AuthGuard)
    async getAllUsers(): Promise<UserDocument[]> {
        Logger.log(`UsersController->getAllUsers() entered`);
        const results = await this.userService.getAllUsers();
        return results;
    }


    @Put('/update-user')
    @Roles(AccessLayer.ADMIN, AccessLayer.SUPER_ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async changeUserDetails(@Body() userUpdateDto: UserUpdateDto): Promise<UserDocument> {
        Logger.log(`UsersController->changeUserDetails() entered with: ${Utils.toString(userUpdateDto)}`);
        const updated = await this.userService.changeUserDetails(userUpdateDto);
        Logger.log(`UsersController->changeUserDetails() got: ${Utils.toString(updated)}`);
        return updated;
    }

    @Delete('/:id')
    @Roles(AccessLayer.ADMIN, AccessLayer.SUPER_ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async deleteUser(@Param('id') id: Types.ObjectId) {
        Logger.log(`UsersController->deleteUser() entered with: ${Utils.toString(id)}`);
        const deletedId = await this.userService.deleteUser(id);
        Logger.log(`UsersController->deleteUser() got: ${id}`);
        return deletedId;

    }

    @Put('/suspend-user')
    @Roles(AccessLayer.ADMIN, AccessLayer.SUPER_ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async changeUserAvailabilty(@Body() userAvailablityDto: UserAvailablityDto) {
        Logger.log(`UsersController->changeUserAvailabilty() entered with: ${Utils.toString(userAvailablityDto)}`);
        const result = await this.userService.changeUserAvaialblity(userAvailablityDto);
        Logger.log(`UsersController->changeUserAvailabilty() got: ${Utils.toString(result)}`);
        return result;

    }

    @Put('/forgot-password')
    @UsePipes(ValidationPipe)
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
        return await this.userService.forgotPassword(forgotPasswordDto);
    }
}
