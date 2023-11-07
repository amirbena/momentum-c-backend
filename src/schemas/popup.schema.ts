import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { MAX_NAME_LENGTH, } from 'src/constants/constants';
import { User } from './user.schema';

export type PopupDocument = HydratedDocument<Popup>;

@Schema()
export class Popup {

    @Prop({ required: true, maxlength: MAX_NAME_LENGTH })
    headline: string;

    @Prop({ required: true, maxlength: MAX_NAME_LENGTH })
    description: string;

    @Prop({ required: true, type: Date })
    creationDate: Date = new Date();

    @Prop({ required: true, type: Date })
    scheudlingDate: Date;
    
}

export const PopupSchema = SchemaFactory.createForClass(Popup);