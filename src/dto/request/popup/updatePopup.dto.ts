import { IsNotEmpty } from "class-validator";
import { IsObjectId } from "class-validator-mongo-object-id";
import { Types } from "mongoose";
import { TokenDto } from "../users/tokenDto.dto";

export class UpdatePopupDto {
    @IsNotEmpty()
    @IsObjectId()
    popupId: Types.ObjectId;

    @IsNotEmpty()
    user: TokenDto;
}