import { Product } from "src/dto/schema/product";

export class SellsInstanceDto {
    creationDate: Date ;
    fullName: string;
    totalSells: number;
    sellsToday: Product[];
    newProducts: Product[];
}