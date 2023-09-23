import { IsArray, IsNotEmpty, MaxLength } from "class-validator";
import { MAX_NAME_LENGTH } from "src/constants/constants";
import { Types } from 'mongoose';

export class CreateNotificationDto {
    @IsNotEmpty()
    @MaxLength(MAX_NAME_LENGTH)
    headline: string;

    @IsNotEmpty()
    @MaxLength(MAX_NAME_LENGTH)
    description: string;

    @IsNotEmpty()
    @IsArray()
    userSentIds: Types.ObjectId[];
}