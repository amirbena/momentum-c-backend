import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { AccessLayer, MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MAX_PHONE_LENGTH, PASSWORD_LENGTH, VideoSection } from 'src/constants/constants';

export type VideoDocument = HydratedDocument<Video>;

@Schema()
export class Video {

    @Prop({ required: true, maxlength: MAX_NAME_LENGTH })
    title: string;

    @Prop({ required: true, maxlength: MAX_PHONE_LENGTH })
    description: string;

    @Prop({ required: true, type: String })
    section: VideoSection;

    @Prop({ required: true, type: Array, default: [AccessLayer.VISITOR] })
    accessLayers: AccessLayer[];

    @Prop({ required: true, type: String })
    link: string;

}

export const VideoSchema = SchemaFactory.createForClass(Video);