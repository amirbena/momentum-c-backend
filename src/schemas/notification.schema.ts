import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MAX_NAME_LENGTH, } from 'src/constants/constants';
import { User } from './user.schema';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema()
export class Notification {

    @Prop({ required: true, maxlength: MAX_NAME_LENGTH })
    headline: string;

    @Prop({ required: true, maxlength: MAX_NAME_LENGTH })
    description: string;

    @Prop({type: [{ type: Types.ObjectId, ref: 'User' }] })
    usersToPing: User[]



}

export const NotificationSchema = SchemaFactory.createForClass(Notification);