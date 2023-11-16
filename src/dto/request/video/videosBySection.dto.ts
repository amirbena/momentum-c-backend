import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { AccessLayer, VideoSection } from "src/constants/constants";
import { TokenDto } from "../users/tokenDto.dto";

export class VideosBySection {

    @IsNotEmpty()
    @IsEnum(VideoSection)
    section: VideoSection;

    @IsNotEmpty()
    user: TokenDto;

}