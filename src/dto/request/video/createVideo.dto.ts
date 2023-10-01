import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsUrl, MaxLength, ValidateNested } from "class-validator";
import { AccessLayer, MAX_NAME_LENGTH, VideoSection } from "src/constants/constants";

export class CreateVideoDto {

    @IsNotEmpty()
    @MaxLength(MAX_NAME_LENGTH)
    title: string;

    @IsNotEmpty()
    @MaxLength(MAX_NAME_LENGTH)
    description: string;

    @IsNotEmpty()
    @IsEnum(VideoSection)
    section: VideoSection;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => String)
    accessLayers: AccessLayer[] = [AccessLayer.VISITOR];



    @IsNotEmpty()
    @IsUrl()
    link: string;
}