import { Injectable, ConflictException, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { PrivateKey } from 'src/private-keys/private-keys';
import { UserDto } from 'src/dto/request/user.dto';
import * as bcrypt from 'bcrypt';
import { AccessLayer, BCRYPT_ROUNDS, TIME, LOGIN_REGISTER_MESSAGE } from 'src/constants/constants';
import { LoginDto } from 'src/dto/request/login.dto';
import { Utils } from 'src/utils/Utils';
import { LoginResponse } from 'src/dto/response/login.response';
import { UserUpdateDto } from 'src/dto/request/userUpdate.dto';
import { UserAvailablityDto } from 'src/dto/request/changeUserAvailablity.dto';


@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService, private privateKey: PrivateKey) { }

    async createUser(userdto: UserDto): Promise<LoginResponse> {
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
        Logger.log(`UsersService->userLogin() entered with: ${Utils.toString(loginDto)}`);
        const { email, password } = loginDto;
        const userWithEmail = await this.userModel.findOne({ email });
        if (!userWithEmail) {
            Logger.warn(`UsersService->userLogin() email not found in DB`);
            throw new NotFoundException("email not found");
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
        updatedItem.isBanned = isBanned;
        return updatedItem;
    }
}
