import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AccessLayer, MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MAX_PHONE_LENGTH, PASSWORD_LENGTH } from 'src/constants/constants';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {

    @Prop({ required: true, maxlength: MAX_NAME_LENGTH })
    fullName: string;

    @Prop({ required: true, maxlength: MAX_PHONE_LENGTH })
    phoneNumber: string;

    @Prop({ required: true, maxlength: MAX_EMAIL_LENGTH })
    email: string;

    @Prop({ required: true, type: String })
    password: string;

    @Prop({ required: true, type: String })
    accessLayer: AccessLayer;

    @Prop({ required: true, default: false })
    isBanned?: boolean = false;

    @Prop({ required: true, default: '' })
    resetToken?: string = "";
}

export const UserSchema = SchemaFactory.createForClass(User);