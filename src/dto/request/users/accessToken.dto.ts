import { IsNotEmpty } from "class-validator";

export class AccessTokenDto {
    
    @IsNotEmpty()
    accessToken: string;
}