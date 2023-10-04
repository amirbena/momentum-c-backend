import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { AccessLayer, VideoSection } from "src/constants/constants";

export class VideosBySection {

    @IsNotEmpty()
    @IsEnum(VideoSection)
    section: VideoSection;

    @IsOptional()
    @IsEnum(AccessLayer)
    accessLayer: AccessLayer = AccessLayer.VISITOR;

}