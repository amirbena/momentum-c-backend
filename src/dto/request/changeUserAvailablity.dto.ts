import { IsBoolean, IsNotEmpty, IsUUID } from "class-validator";
import { Types } from "mongoose";

export class UserAvailablityDto {

    @IsNotEmpty()
    @IsUUID("4")
    id: Types.ObjectId;

    @IsNotEmpty()
    @IsBoolean()
    isBanned: boolean;
}
