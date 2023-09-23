import { IsNotEmpty } from "class-validator";
import { Types } from 'mongoose';
import { IsObjectId } from 'class-validator-mongo-object-id';

export class NotificationByUserDto {

    @IsNotEmpty()
    @IsObjectId()
    userId: Types.ObjectId;
}