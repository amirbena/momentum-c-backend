import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private UserModel: Model<User>) { }

    async createUser(user: User): Promise<UserDocument> {
        try {
            const userItem = new this.UserModel(user);
            return await userItem.save();
        } catch (error) {

        }

    }
}
