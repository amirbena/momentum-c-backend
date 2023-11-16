import { IsNotEmpty } from "class-validator";
import { AccessLayer } from "src/constants/constants";

export class TokenDto {
    @IsNotEmpty()
    email: string;
    @IsNotEmpty()
    fullName: string;
    @IsNotEmpty()
    accessLayer: AccessLayer;
}