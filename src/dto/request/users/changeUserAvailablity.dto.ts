import { IsBoolean, IsNotEmpty } from "class-validator";
import { Types } from "mongoose";
import { IsObjectId } from 'class-validator-mongo-object-id';
import { TokenDto } from "./tokenDto.dto";

export class UserAvailablityDto {

    @IsNotEmpty()
    @IsObjectId()
    id: Types.ObjectId;

    @IsNotEmpty()
    @IsBoolean()
    isBanned: boolean;

    @IsNotEmpty()
    user: TokenDto;
}
