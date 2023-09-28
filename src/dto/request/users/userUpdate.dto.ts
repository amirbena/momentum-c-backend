import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsUUID, Matches, MaxLength } from "class-validator";
import { Types } from "mongoose";
import { AccessLayer, ISRAELI_PHONE_REGEX, MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MAX_PHONE_LENGTH, PASSWORD_LENGTH } from "src/constants/constants";
import { IsObjectId } from 'class-validator-mongo-object-id';
export class UserUpdateDto {

    @IsNotEmpty()
    @IsObjectId()
    id: Types.ObjectId;


    @IsOptional()
    @MaxLength(MAX_NAME_LENGTH)
    fullName?: string;

    @IsOptional()
    @MaxLength(MAX_PHONE_LENGTH)
    @Matches(ISRAELI_PHONE_REGEX)
    phoneNumber?: string;

    @IsOptional()
    @MaxLength(MAX_EMAIL_LENGTH)
    @IsEmail()
    email?: string;

    @IsOptional()
    @MaxLength(PASSWORD_LENGTH)
    password?: string;

    @IsOptional()
    @IsEnum(AccessLayer)
    accessLayer?: AccessLayer;
}
