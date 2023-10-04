import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateVideoDto } from 'src/dto/request/video/createVideo.dto';
import { UpdateVideoDto } from 'src/dto/request/video/updateVideo.dto';
import { VideosBySection } from 'src/dto/request/video/videosBySection.dto';
import { Video, VideoDocument } from 'src/schemas/videos.schema';
import { Utils } from 'src/utils/Utils';

@Injectable()
export class VideosService {
    /**
     * TODO: AuthGuard for videos, CREATE POPUP MODULE, USER ADD ACCESS, READ DRIVE FILE AND CREATE IT, CREATE CRON JOB FOR ACCESSING DRIVE SECTIONS.
     */
    constructor(@InjectModel(Video.name) private videoModel: Model<Video>) { }


    async createVideo(createVideoDto: CreateVideoDto): Promise<VideoDocument> {
        Logger.log(`VideosService->createVideo() entered with: ${Utils.toString(createVideoDto)}`);
        const video: Video = {
            ...createVideoDto
        }
        const videoDoc = new this.videoModel(video);
        await videoDoc.save();
        Logger.log(`VideosService->createVideo() got: ${Utils.toString(videoDoc)}`);
        return videoDoc;
    }

    async getVideosBySection(videosBySection: VideosBySection): Promise<VideoDocument[]> {
        Logger.log(`VideosService->getVideoBySection() entered with: ${Utils.toString(videosBySection)}`);
        const { section, accessLayer } = videosBySection;
        const videos = await this.videoModel.find({ section, accessLayers: { "$in": [accessLayer] } });
        if (!videos.length) {
            throw new NotFoundException([], `Not videos found`);
        }
        Logger.log(`VideosService->getVideoBySection() got: ${Utils.toString(videos)}`);
        return videos;
    }

    async updateVideo(updateVideoDto: UpdateVideoDto): Promise<VideoDocument> {
        Logger.log(`VideosService->updateVideo() entered with: ${Utils.toString(updateVideoDto)}`);
        const { videoId } = updateVideoDto;
        let updatedVideo = await this.videoModel.findByIdAndUpdate(videoId, updateVideoDto);
        if (!updatedVideo) {
            throw new NotFoundException(`Not video found`);
        }
        Logger.log(`VideosService->updateVideo() got: ${Utils.toString(updatedVideo)}`);
        Object.entries(updateVideoDto).forEach(([key, value]) => {
            if (value) updatedVideo[key] = value;
        })
        return updatedVideo;
    }

    async deleteVideo(videoId: Types.ObjectId): Promise<VideoDocument> {
        Logger.log(`VideosService->deleteVideo() entered with: ${Utils.toString(videoId)}`);
        let deletedId = await this.videoModel.findByIdAndDelete(videoId);
        Logger.log(`VideosService->deleteVideo() got: ${Utils.toString(deletedId)}`);
        return deletedId;
    }


}
