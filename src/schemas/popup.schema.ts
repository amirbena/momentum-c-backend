import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { AccessLayer, MAX_NAME_LENGTH, } from 'src/constants/constants';

export type PopupDocument = HydratedDocument<Popup>;

@Schema()
export class Popup {

    @Prop({ required: true, maxlength: MAX_NAME_LENGTH })
    title: string;

    @Prop({ required: true, maxlength: MAX_NAME_LENGTH })
    description: string;

    @Prop({ required: true, type: Array, default: [AccessLayer.VISITOR] })
    accessLayers: AccessLayer[];

    @Prop({ required: true })
    link: string;

    @Prop({ required: true, type: Date })
    creationDate: Date = new Date();

    @Prop({ required: false, type: Date })
    scheudlingDate?: Date;

    @Prop({ required: false, type: Array })
    userReadIds: Types.ObjectId[];

}

export const PopupSchema = SchemaFactory.createForClass(Popup);