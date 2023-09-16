import { Injectable, ConflictException, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { PrivateKey } from 'src/private-keys/private-keys';
import { UserDto } from 'src/dto/user.dto';
import * as bcrypt from 'bcrypt';
import { AccessLayer, BCRYPT_ROUNDS, TIME } from 'src/constants/constants';
import { LoginDto } from 'src/dto/login.dto';
import { Utils } from 'src/utils/Utils';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService, private privateKey: PrivateKey) { }

    async createUser(userdto: UserDto): Promise<string> {
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
            return token;
        } catch (error) {
            Logger.error(`UsersService->createUser() has error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException("Something got wrong- can't continue");
        }


    }

    async userLogin(loginDto: LoginDto) {
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
            throw new NotFoundException("passwords not match");
        }
        try {
            Logger.log(`UsersService->userLogin() login successfully`);
            const { email, accessLayer, fullName } = userWithEmail;
            const token = await this.jwtService.signAsync({ email, accessLayer, fullName }, { secret: await this.privateKey.getPrivateKey(), expiresIn: TIME.HOUR });
            Logger.log(`UsersService->userLogin() got token: ${token}`);
            return token;
        } catch (error) {
            Logger.error(`UsersService->userLogin() has error occured: ${Utils.toString(error)}`);
            throw new InternalServerErrorException("Something got wrong- can't continue");
        }
    }
}
