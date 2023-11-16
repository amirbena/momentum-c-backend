import { IsDate, IsNotEmpty } from "class-validator";
import { TokenDto } from "../users/tokenDto.dto";

export class RetreivePopups {

    @IsNotEmpty()
    @IsDate()
    dateToCheck: Date;

    @IsNotEmpty()
    user: TokenDto;
}