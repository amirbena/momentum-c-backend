import { Injectable, ConflictException, Logger, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { PrivateKey } from 'src/private-keys/private-keys';
import { UserDto } from 'src/dto/request/users/user.dto';
import * as bcrypt from 'bcrypt';
import { AccessLayer, BCRYPT_ROUNDS, TIME, LOGIN_REGISTER_MESSAGE, EMAIL_ID, RAND_TOKEN_SIZE } from 'src/constants/constants';
import { LoginDto } from 'src/dto/request/users/login.dto';
import { Utils } from 'src/utils/Utils';
import { LoginResponse } from 'src/dto/response/login.response';
import { UserUpdateDto } from 'src/dto/request/users/userUpdate.dto';
import { UserAvailablityDto } from 'src/dto/request/users/changeUserAvailablity.dto';
import fs from 'fs';
import { ForgotPasswordDto } from 'src/dto/request/users/forgotPassword.dto';
import { EmailOptions } from 'src/mail/mailOptions.model';
import { generate } from 'rand-token';
import { MailService } from 'src/mail/mail.service';
import { RegisterResponse } from 'src/dto/response/register.response';
import { ResetPasswordDto } from 'src/dto/request/users/resetPassword.dto';
import { AccessTokenDto } from 'src/dto/request/users/accessToken.dto';
import { AccessTokenResponse } from 'src/dto/response/accessToken.response';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService, private privateKey: PrivateKey, private mailService: MailService) { }

    async createUser(userdto: UserDto): Promise<RegisterResponse> {
        Logger.log(`UsersService->createUser() entered with: ${Utils.toString(userdto)}`);
        const sameEmail = await this.userModel.find({ email: userdto.email });
        if (sameEmail.length) {
            Logger.warn(`UsersService->createUser() duplicate email in DB`);
            throw new ConflictException("Same Email of register users");
        }
        try {
            const password = await bcrypt.hash(userdto.password, BCRYPT_ROUNDS);
            const user: User = {
                ...userdto,
                password,
                accessLayer: AccessLayer.VISITOR
            }
            const userItem = new this.userModel(user);
            const savedItem = await userItem.save();
            Logger.log(`UsersService->createUser() user registered successfully`);
            const { email, accessLayer, fullName } = savedItem;
            const token = await this.jwtService.signAsync({ email, accessLayer, fullName }, { secret: await this.privateKey.getPrivateKey(), expiresIn: TIME.HOUR });
            Logger.log(`UsersService->createUser() got token: ${token}`);
            return { message: LOGIN_REGISTER_MESSAGE, accessToken: token };
        } catch (error) {
            Logger.error(`UsersService->createUser() has error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException("Something got wrong- can't continue");
        }


    }

    async userLogin(loginDto: LoginDto): Promise<LoginResponse> {
        console.log("fs", fs);
        Logger.log(`UsersService->userLogin() entered with: ${Utils.toString(loginDto)}`);
        const { email, password } = loginDto;
        const userWithEmail = await this.userModel.findOne({ email });
        if (!userWithEmail) {
            Logger.warn(`UsersService->userLogin() email not found in DB`);
            throw new NotFoundException("email not found");
        }
        if (userWithEmail.isForverBanned) {
            Logger.warn(`UsersService->userLogin() banned user tried to this section`);
            throw new ForbiddenException("User isn't allowed use this application");

        }
        const samePassword = await bcrypt.compare(password, userWithEmail.password);
        if (!samePassword) {
            Logger.warn(`UsersService->userLogin() passwords not match`);
            throw new ConflictException("passwords not match");
        }
        try {
            Logger.log(`UsersService->userLogin() login successfully`);
            const { email, accessLayer, fullName } = userWithEmail;
            const token = await this.jwtService.signAsync({ email, accessLayer, fullName }, { secret: await this.privateKey.getPrivateKey(), expiresIn: TIME.HOUR });
            Logger.log(`UsersService->userLogin() got token: ${token}`);
            return { message: LOGIN_REGISTER_MESSAGE, accessToken: token };
        } catch (error) {
            Logger.error(`UsersService->userLogin() has error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException("Something got wrong- can't continue");
        }
    }

    async getAllUsers(): Promise<UserDocument[]> {
        Logger.log(`UsersService->getAllUsers() entered`);
        const results: UserDocument[] = await this.userModel.find();
        Logger.log(`UsersService->getAllUsers() got: ${Utils.toString(results)}`);
        return results;
    }


    async changeUserDetails(userUpdateDto: UserUpdateDto): Promise<UserDocument> {
        Logger.log(`UsersService->changeUserDetails() entered with: ${Utils.toString(userUpdateDto)}`);
        const { id, password } = userUpdateDto;
        if (password) {
            Logger.log(`UsersService->changeUserDetails() password need to be hashed`);
            userUpdateDto.password = await bcrypt.hash(password, BCRYPT_ROUNDS);
        }
        let updatedItem = await this.userModel.findOneAndUpdate({ _id: id }, userUpdateDto);
        if (!updatedItem) {
            Logger.warn(`UsersService->changeUserDetails() can't found id, can't update`);
            throw new NotFoundException("Can't find id");
        }
        Object.entries(userUpdateDto).forEach(([key, value]) => {
            if (value) {
                updatedItem[key] = value;
            }
        });
        return updatedItem;


    }

    async deleteUser(id: Types.ObjectId) {
        Logger.log(`UsersService->changeUserDetails() entered with: ${Utils.toString(id)}`);
        const deleted = await this.userModel.deleteOne({ _id: id });
        if (!deleted.deletedCount) {
            Logger.warn(`UsersService->changeUserDetails() not item deleted, item not found`)
            throw new NotFoundException("Can't find id");
        }

        return id;
    }

    async changeUserAvaialblity(userAvailablityDto: UserAvailablityDto): Promise<UserDocument> {
        Logger.log(`UsersService->changeUserAvaialblity() entered with: ${Utils.toString(userAvailablityDto)}`);
        const { id, isBanned } = userAvailablityDto;
        let updatedItem = await this.userModel.findByIdAndUpdate(id, { isBanned });
        if (!updatedItem) {
            Logger.warn(`UsersService->changeUserAvaialblity() can't found id, can't update`);
            throw new NotFoundException("Can't find id");
        }
        updatedItem.isBannedTemporary = isBanned;
        return updatedItem;
    }

    private createForgotPasswordUrlWithToken(token: string, language: string) {
        const messages = {
            English: `<p>You requested for reset password, kindly use this <a href="${process.env.FRONTEND_URI}/reset-password?token='${token}'">link</a> to reset your password</p>`,
            Hebrew: `<p>ביקשת לשנות את הסיסמה שלך, ניתן להשתמש בקישור הבא: <a href="${process.env.FRONTEND_URI}/reset-password?token='${token}'">לחץ כאן כדי לעדכן את הסיסמה שלך</a>`
        }
        const subjects = {
            English: "Did you forget your password?",
            Hebrew: "האם שכחת את הסיסמה שלך"
        }
        return {
            subject: subjects[language] || "",
            html: messages[language] || ""
        }
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        Logger.log(`UsersService->forgotPassword() entered with: ${Utils.toString(forgotPasswordDto)}`);
        const { email, language } = forgotPasswordDto;
        let emailObject = await this.userModel.findOne({ email });
        if (!emailObject) {
            Logger.warn(`UsersService->forgotPassword() email is not found`);
            throw new NotFoundException(`Email isn't found of reset password`);
        }
        const token = generate(RAND_TOKEN_SIZE);
        const { subject, html } = this.createForgotPasswordUrlWithToken(token, language);
        const emailOptions: EmailOptions = {
            from: EMAIL_ID,
            to: email,
            subject,
            html
        }

        const isSent = await this.mailService.sendEmail(emailOptions);
        emailObject.resetToken = token;
        await emailObject.save();
        Logger.log(`UsersService->forgotPassword() got ${Utils.toString(isSent)}`);
        return isSent;
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<boolean> {
        Logger.log(`UsersService->resetPassword() entered with: ${Utils.toString(resetPasswordDto)}`);
        const { password, resetToken } = resetPasswordDto;
        let userObject = await this.userModel.findOne({ resetToken });
        if (!userObject) {
            Logger.warn(`UsersService->resetPassword() resetToken not found`);
            throw new NotFoundException("Reset Token isn't found");
        }
        userObject.password = await bcrypt.hash(password, BCRYPT_ROUNDS);
        await userObject.save();
        return true;

    }

    async defineToken(accessTokenDto: AccessTokenDto): Promise<AccessTokenResponse> {
        Logger.log(`UsersService->defineToken() entered with: ${Utils.toString(accessTokenDto)}`);
        const { accessToken } = accessTokenDto;
        try {
            const secret = await this.privateKey.getPrivateKey();
            const payload: { accessLayer: AccessLayer } = await this.jwtService.verifyAsync(accessToken, { secret });
            if (!payload) {
                Logger.warn(`UsersService->defineToken() got error`);
                return {
                    isAdmin: false,
                    isRegularUser: false
                }
            }
            const { accessLayer } = payload;
            return {
                isAdmin: accessLayer === AccessLayer.SUPER_ADMIN || accessLayer === AccessLayer.ADMIN,
                isRegularUser: accessLayer !== AccessLayer.VISITOR
            }


        } catch (error) {
            Logger.warn(`UsersService->defineToken() got: ${Utils.toString(error)}`);
            return {
                isAdmin: false,
                isRegularUser: false
            }
        }
    }

    async banUser(userId: Types.ObjectId) {
        Logger.log(`UsersService->banUser() entered with: ${Utils.toString(userId)}`);
        let updatedItem = await this.userModel.findByIdAndUpdate(userId, { isForverBanned: true });
        if (!updatedItem) {
            Logger.warn(`UUsersService->banUser() can't found id, can't update`);
            throw new NotFoundException("Can't find id");
        }
        updatedItem.isForverBanned = true;
        return updatedItem;
    }
}
