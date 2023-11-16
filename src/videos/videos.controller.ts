import { Controller, Post, UseGuards, UsePipes, ValidationPipe, Body, Logger, Put, Delete, Param } from '@nestjs/common';
import { VideosService } from './videos.service';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/guards/roles/roles.decorator';
import { AccessLayer } from 'src/constants/constants';
import { CreateVideoDto } from 'src/dto/request/video/createVideo.dto';
import { Utils } from 'src/utils/Utils';
import { VideosBySection } from 'src/dto/request/video/videosBySection.dto';
import { UpdateVideoDto } from 'src/dto/request/video/updateVideo.dto';
import { Types } from 'mongoose';
import { VideoDocument } from 'src/schemas/videos.schema';

@Controller('videos')
export class VideosController {
    constructor(private videosService: VideosService) { }

    @Post()
    @Roles(AccessLayer.SUPER_ADMIN, AccessLayer.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async createVideo(@Body() createVideoDto: CreateVideoDto) {
        Logger.log(`VideosController->createVideo() entered with: ${Utils.toString(createVideoDto)}`);
        const result = await this.videosService.createVideo(createVideoDto);
        Logger.log(`VideosController->createVideo() got: ${Utils.toString(result)}`);
        return result;
    }

    @Post('/videos-by-access-layer')
    @UseGuards(AuthGuard)
    @UsePipes(ValidationPipe)
    async videosByAccessLayer(@Body() videosBySection: VideosBySection): Promise<VideoDocument[]> {
        Logger.log(`VideosController->videosByAccessLayer() entered with: ${Utils.toString(videosBySection)}`);
        const videos = await this.videosService.getVideosBySection(videosBySection);
        Logger.log(`VideosController->videosByAccessLayer() got: ${Utils.toString(videos)}`);
        return videos;
    }

    @Put()
    @Roles(AccessLayer.SUPER_ADMIN, AccessLayer.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async updateVideo(@Body() updateVideoDto: UpdateVideoDto) {
        Logger.log(`VideosController->updateVideo() entered with: ${Utils.toString(updateVideoDto)}`);
        const updatedVideo = await this.videosService.updateVideo(updateVideoDto)
        Logger.log(`VideosController->updateVideo() got: ${Utils.toString(updatedVideo)}`);
        return updatedVideo;
    }

    @Delete('/:id')
    @Roles(AccessLayer.SUPER_ADMIN, AccessLayer.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UsePipes(ValidationPipe)
    async deleteVideo(@Param('id') videoId: Types.ObjectId) {
        Logger.log(`VideosController->deleteVideo() entered with: ${Utils.toString(videoId)}`);
        const deletedVideo = await this.videosService.deleteVideo(videoId);
        Logger.log(`VideosController->updateVideo() got: ${Utils.toString(deletedVideo)}`);
        return deletedVideo;
    }
}
