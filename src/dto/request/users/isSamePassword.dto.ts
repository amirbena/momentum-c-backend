import { IsNotEmpty, MinLength } from "class-validator";
import { TokenDto } from "./tokenDto.dto";

export class IsSamePasswordDto {

    @IsNotEmpty()
    @MinLength(8)
    password: string;

    user: TokenDto;

}