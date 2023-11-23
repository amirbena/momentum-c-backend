import { IsArray, IsDate, IsNotEmpty, IsOptional, IsUrl, MaxLength } from "class-validator";
import { AccessLayer, MAX_NAME_LENGTH } from "src/constants/constants";
import { IsAccessLayerArray } from "src/decorators/isAccessLayerArray.decorator";
import { TokenDto } from "../users/tokenDto.dto";

export class CreateSchedualingPopup {
    @IsNotEmpty()
    @MaxLength(MAX_NAME_LENGTH)
    title: string;

    @IsNotEmpty()
    @MaxLength(MAX_NAME_LENGTH)
    description: string;

    @IsNotEmpty()
    @IsArray()
    @IsAccessLayerArray()
    accessLayers: AccessLayer[];

    @IsNotEmpty()
    @IsUrl()
    link: string;

    @IsOptional()
    @IsDate()
    creationDate: Date = new Date();

    @IsNotEmpty()
    @IsDate()
    scheudlingDate: Date;

    
    user: TokenDto;
}