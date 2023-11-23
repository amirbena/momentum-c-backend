import { IsNotEmpty } from "class-validator";
import { AccessLayer } from "src/constants/constants";

export class TokenDto {
    email: string;
    fullName: string;
    accessLayer: AccessLayer;
}