import { IsArray, IsDate, IsNotEmpty, IsOptional, IsUrl, MaxLength } from "class-validator";
import { AccessLayer, MAX_NAME_LENGTH } from "src/constants/constants";
import { IsAccessLayerArray } from "src/decorators/isAccessLayerArray.decorator";
import { TokenDto } from "../users/tokenDto.dto";
import { Transform } from "class-transformer";

export class CreateRegularPopup {
    @IsNotEmpty()
    @MaxLength(MAX_NAME_LENGTH)
    title: string;

    @IsNotEmpty()
    @MaxLength(MAX_NAME_LENGTH)
    description: string;

    @IsNotEmpty()
    @IsAccessLayerArray()
    accessLayers: AccessLayer[];

    @IsNotEmpty()
    link: string;

    @IsNotEmpty()
    @Transform( ({ value }) => new Date(value))
    @IsDate()
    creationDate: Date;


    user: TokenDto;
}