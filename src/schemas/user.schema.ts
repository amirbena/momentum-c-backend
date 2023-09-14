import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { MaxLength, IsNotEmpty, Matches, IsEmail, IsEnum } from 'class-validator';
import { HydratedDocument, Model } from 'mongoose';
import { ACCESS_LAYERS, ISRAELI_PHONE_REGEX, MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MAX_PHONE_LENGTH } from 'src/constants/constants';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

    @Prop({ required: true, maxlength: MAX_NAME_LENGTH })
    @IsNotEmpty()
    @MaxLength(MAX_NAME_LENGTH)
    fullName: string;

    @Prop({ required: true, maxlength: MAX_PHONE_LENGTH })
    @IsNotEmpty()
    @MaxLength(MAX_PHONE_LENGTH)
    @Matches(ISRAELI_PHONE_REGEX)
    phoneNumber: string;

    @Prop({ required: true, maxlength: MAX_EMAIL_LENGTH })
    @IsNotEmpty()
    @MaxLength(MAX_EMAIL_LENGTH)
    @IsEmail()
    email: string;

    @Prop({ required: true })
    @IsNotEmpty()
    @IsEnum(ACCESS_LAYERS)
    accessLayer: ACCESS_LAYERS;
}

export const UserSchema = SchemaFactory.createForClass(User);