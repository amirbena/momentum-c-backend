import { IsDate, IsNotEmpty } from "class-validator";
import { TokenDto } from "../users/tokenDto.dto";
import { Transform } from "class-transformer";

export class RetreivePopups {

    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    dateToCheck: Date;

    user: TokenDto;
}