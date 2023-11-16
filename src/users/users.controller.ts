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
import { RegisterResponse } from 'src/dto/response/register.response';
import { LoginResponse } from 'src/dto/response/login.response';
import { ResetPasswordDto } from 'src/dto/request/users/resetPassword.dto';
import { AccessTokenDto } from 'src/dto/request/users/accessToken.dto';
import { TokenDto } from 'src/dto/request/users/tokenDto.dto';
import { IsSamePasswordDto } from 'src/dto/request/users/isSamePassword.dto';


@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) { }

    @Post('/register')
    @UsePipes(ValidationPipe)
    async register(@Body() user: UserDto): Promise<RegisterResponse> {
        Logger.log(`UsersController->register() entered with: ${Utils.toString(user)}`);
        const result = await this.userService.createUser(user);
        Logger.log(`UsersController->register() got ${Utils.toString(result)}`);
        return result;
    }

    @Post('/login')
    @UsePipes(ValidationPipe)
    async login(@Body() userlogin: LoginDto): Promise<LoginResponse> {
        Logger.log(`UsersController->register() entered with: ${Utils.toString(userlogin)}`);
        const result = await this.userService.userLogin(userlogin);
        Logger.log(`UsersController->register() got ${Utils.toString(result)}`);
        return result;
    }

    @Post('/logout')
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    async logout(@Body() user: TokenDto) {
        return await this.userService.logout(user);
    }

    @Get()
    @UseGuards(AuthGuard)
    async getAllUsers(@Body() user: TokenDto): Promise<UserDocument[]> {
        Logger.log(`UsersController->getAllUsers() entered`);
        const results = await this.userService.getAllUsers(user);
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

    @Delete('/ban-forver/:id')
    @Roles(AccessLayer.ADMIN, AccessLayer.SUPER_ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async banUserForver(@Param('id') id: Types.ObjectId) {
        Logger.log(`UsersController->banUserForver() entered with: ${Utils.toString(id)}`);
        const deletedForverUser = await this.userService.banUser(id);
        Logger.log(`UsersController->banUserForver() got: ${deletedForverUser}`);
        return deletedForverUser;

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

    @Post('/define-token')
    @UsePipes(ValidationPipe)
    async defineToken(@Body() accessTokenDto: AccessTokenDto) {
        return await this.userService.defineToken(accessTokenDto);
    }

    @Post('/is-same-password')
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    async isSamePassword(@Body() isSamePassword: IsSamePasswordDto) {
        return await this.userService.isSamePassword(isSamePassword);
    }

    @Put('/forgot-password')
    @UsePipes(ValidationPipe)
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return await this.userService.forgotPassword(forgotPasswordDto);
    }

    @Put('/reset-password')
    @UsePipes(ValidationPipe)
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return await this.userService.resetPassword(resetPasswordDto);
    }
}
