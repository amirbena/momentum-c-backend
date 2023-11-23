import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Product } from 'src/dto/schema/product';

export type SellsDocument = HydratedDocument<Sells>;

@Schema()
export class Sells {

    @Prop({ required: true })
    creationDate: Date;

    @Prop({ type: String })
    fullName: string;

    @Prop({ type: Number })
    totalSells: number;

    @Prop({ type: Array })
    sellsToday: Product[];

    @Prop({ type: Array })
    newProducts: Product[];

}

export const SellsSchema = SchemaFactory.createForClass(Sells);