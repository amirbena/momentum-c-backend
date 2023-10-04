import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsUrl, MaxLength } from "class-validator";
import { AccessLayer, MAX_NAME_LENGTH, VideoSection } from "src/constants/constants";
import { IsAccessLayerArray } from "src/decorators/isAccessLayerArray.decorator";




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
    @IsAccessLayerArray()
    accessLayers: AccessLayer[] = [AccessLayer.VISITOR];

    @IsNotEmpty()
    @IsUrl()
    link: string;
}