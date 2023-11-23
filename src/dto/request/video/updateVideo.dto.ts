import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsOptional, IsUrl, MaxLength, ValidateNested } from "class-validator";
import { IsObjectId } from "class-validator-mongo-object-id";
import { Types } from "mongoose";
import { AccessLayer, MAX_NAME_LENGTH, VideoSection } from "src/constants/constants";
import { Type } from "class-transformer";
import { TokenDto } from "../users/tokenDto.dto";

export class UpdateVideoDto {

    @IsNotEmpty()
    @IsObjectId()
    videoId: Types.ObjectId;

    @IsOptional()
    @MaxLength(MAX_NAME_LENGTH)
    title?: string;

    @IsOptional()
    @MaxLength(MAX_NAME_LENGTH)
    description?: string;

    @IsOptional()
    @IsEnum(VideoSection)
    section?: VideoSection;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => String)
    accessLayers: AccessLayer[];

    @IsOptional()
    @IsUrl()
    link?: string;


    user: TokenDto;
}