import { IsArray, IsBoolean, IsNotEmpty, IsOptional, MaxLength } from "class-validator";
import { IsObjectId } from "class-validator-mongo-object-id";
import { Types } from "mongoose";
import { MAX_NAME_LENGTH } from "src/constants/constants";


export class UpdateNotificationDto {

    @IsNotEmpty()
    @IsObjectId()
    notificationId: Types.ObjectId;

    @IsNotEmpty()
    @MaxLength(MAX_NAME_LENGTH)
    headline?: string;

    @IsOptional()
    @MaxLength(MAX_NAME_LENGTH)
    description?: string;

    @IsOptional()
    @IsArray()
    userSentIds?: Types.ObjectId[];

    @IsOptional()
    @IsBoolean()
    isRead?: boolean;
}