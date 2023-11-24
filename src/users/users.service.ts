import { Injectable, ConflictException, Logger, InternalServerErrorException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { PrivateKey } from 'src/private-keys/private-keys';
import { UserDto } from 'src/dto/request/users/user.dto';
import * as bcrypt from 'bcrypt';
import { AccessLayer, BCRYPT_ROUNDS, TIME, LOGIN_REGISTER_MESSAGE, MOMENTUM_MAIL_EMAIL, RAND_TOKEN_SIZE } from 'src/constants/constants';
import { LoginDto } from 'src/dto/request/users/login.dto';
import { Utils } from 'src/utils/Utils';
import { LoginResponse } from 'src/dto/response/login.response';
import { UserUpdateDto } from 'src/dto/request/users/userUpdate.dto';
import { UserAvailablityDto } from 'src/dto/request/users/changeUserAvailablity.dto';
import { ForgotPasswordDto } from 'src/dto/request/users/forgotPassword.dto';
import { EmailOptions } from 'src/mail/mailOptions.model';
import { generate } from 'rand-token';
import { MailService } from 'src/mail/mail.service';
import { RegisterResponse } from 'src/dto/response/register.response';
import { ResetPasswordDto } from 'src/dto/request/users/resetPassword.dto';
import { AccessTokenDto } from 'src/dto/request/users/accessToken.dto';
import { AccessTokenResponse } from 'src/dto/response/accessToken.response';
import { TokenDto } from 'src/dto/request/users/tokenDto.dto';
import { IsSamePasswordDto } from 'src/dto/request/users/isSamePassword.dto';


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
                accessLayer: AccessLayer.VISITOR,
                lastTimeOfLogin: new Date()
            }
            const userItem = new this.userModel(user);
            const savedItem = await userItem.save();
            Logger.log(`UsersService->createUser() user registered successfully`);
            const { email, accessLayer, fullName }: TokenDto = savedItem;
            const privateKey = await this.privateKey.getPrivateKey();
            const token = await this.jwtService.signAsync({ email, accessLayer, fullName }, { secret: privateKey, expiresIn:2 * TIME.DAY });
            Logger.log(`UsersService->createUser() got token: ${token}`);
            return {
                message: LOGIN_REGISTER_MESSAGE,
                accessToken: token,
                isAdmin: false,
                isRegularUser: true
            };
        } catch (error) {
            Logger.error(`UsersService->createUser() has error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException("Something got wrong- can't continue");
        }
    }

    async getIdByFullName(fullName: string): Promise<string | Types.ObjectId> {
        Logger.log(`UsersService->getIdByFullName() entered with: ${fullName}`)
        const foundUser = await this.userModel.findOne({ fullName });
        if (!foundUser) {
            return "";
        }
        return foundUser._id;
    }

    async userLogin(loginDto: LoginDto): Promise<LoginResponse> {
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
            userWithEmail.lastTimeOfLogin = new Date();
            await userWithEmail.save();
            const token = await this.jwtService.signAsync({ email, accessLayer, fullName }, { secret: await this.privateKey.getPrivateKey(), expiresIn: 2 * TIME.DAY });
            Logger.log(`UsersService->userLogin() got token: ${token}`);
            return {
                message: LOGIN_REGISTER_MESSAGE,
                accessToken: token,
                isAdmin: accessLayer === AccessLayer.SUPER_ADMIN || accessLayer === AccessLayer.ADMIN,
                isRegularUser: true
            };
        } catch (error) {
            Logger.error(`UsersService->userLogin() has error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException("Something got wrong- can't continue");
        }
    }

    async getAllUsers(tokenDto: TokenDto): Promise<UserDocument[]> {
        Logger.log(`UsersService->getAllUsers() entered`);
        const results: UserDocument[] = await this.userModel.find();
        await this.updateUserDto(tokenDto);
        Logger.log(`UsersService->getAllUsers() got: ${Utils.toString(results)}`);
        return results;
    }

    async updateUserDto(tokenDto: TokenDto): Promise<void> {
        const findUser = await this.userModel.findOne({ fullName: tokenDto.fullName });
        if (!findUser) {
            Logger.warn(`UsersService->updateUserDto() user is not found`);
            throw new NotFoundException("NOT FOUND");
        }
        findUser.lastTimeOfMakingAction = new Date();
        findUser.timeUsingApplication += Math.floor((findUser.lastTimeOfMakingAction.getTime() - findUser.lastTimeOfLogin.getTime()) / 1000);
        await findUser.save();
    }

    async logout(tokenDto: TokenDto): Promise<string> {
        Logger.log(`UsersService->logout() entered with: ${Utils.toString(tokenDto)}`);
        await this.updateUserDto(tokenDto);
        return "Success";
    }


    async changeUserDetails(userUpdateDto: UserUpdateDto): Promise<UserDocument> {
        Logger.log(`UsersService->changeUserDetails() entered with: ${Utils.toString(userUpdateDto)}`);
        const { id, password, user: tokenDto } = userUpdateDto;
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
            if (key != "user" && value) {
                updatedItem[key] = value;
            }
        });
        await this.updateUserDto(tokenDto);
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
        const { id, isBanned, user } = userAvailablityDto;
        let updatedItem = await this.userModel.findByIdAndUpdate(id, { isBanned });
        if (!updatedItem) {
            Logger.warn(`UsersService->changeUserAvaialblity() can't found id, can't update`);
            throw new NotFoundException("Can't find id");
        }
        updatedItem.isBannedTemporary = isBanned;
        await this.updateUserDto(user);
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
            from: MOMENTUM_MAIL_EMAIL,
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
                isRegularUser: true
            }


        } catch (error) {
            Logger.warn(`UsersService->defineToken() got: ${Utils.toString(error)}`);
            return {
                isAdmin: false,
                isRegularUser: false
            }
        }
    }


    async isSamePassword(isSamePasswordDto: IsSamePasswordDto): Promise<boolean> {
        Logger.log(`UsersService->isSamePassword() entered with: ${Utils.toString(isSamePasswordDto)}`);
        const { user: { fullName, ...rest }, password } = isSamePasswordDto;
        try {
            const findUser = await this.userModel.findOne({ fullName });
            if (!findUser) {
                Logger.warn(`UsersService->isSamePassword() password isn't same`);
                return false;
            }
            const result = await bcrypt.compare(password, findUser.password);
            Logger.log(`UsersService->isSamePassword() is Passwords same: ${Utils.toString(result)}`);
            await this.updateUserDto({ fullName, ...rest });
            return result;
        } catch (error) {
            Logger.error(`UsersService->isSamePassword() an error occured: ${Utils.toString(error.message)}`);
            return false;
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

    async checkNameUserExist(name: string) {
        try {
            const user = await this.userModel.findOne({ fullName: { $regex: name, $options: 'i' } });
            if (user) {
                return user.fullName;
            }
            return "";
        } catch (error) {
            return "";
        }
    }
}
