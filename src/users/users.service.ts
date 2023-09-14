import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { PrivateKey } from 'src/private-keys/private-keys';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<User>, private jwtService: JwtService, private privateKey: PrivateKey) { }

    async createUser(user: User): Promise<string> {
        const sameEmail = await this.userModel.find({ email: user.email });
        if (!sameEmail.length) {
            throw new ConflictException("Same Email of register users");
        }
        const userItem = new this.userModel(user);
        const savedItem = await userItem.save();
        const { email, accessLayer, fullName } = savedItem;
        const token = await this.jwtService.signAsync({ email, accessLayer, fullName }, { secret: await this.privateKey.getPrivateKey() });
        return token;

    }
}
