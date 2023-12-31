import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { YOUTUBE, YOUTUBE_EMBDED_LINK } from 'src/constants/constants';
import { CreateVideoDto } from 'src/dto/request/video/createVideo.dto';
import { UpdateVideoDto } from 'src/dto/request/video/updateVideo.dto';
import { VideosBySection } from 'src/dto/request/video/videosBySection.dto';
import { Video, VideoDocument } from 'src/schemas/videos.schema';
import { UsersService } from 'src/users/users.service';
import { Utils } from 'src/utils/Utils';

@Injectable()
export class VideosService {
    /**
     * TODO: AuthGuard for videos, CREATE POPUP MODULE, USER ADD ACCESS, READ DRIVE FILE AND CREATE IT, CREATE CRON JOB FOR ACCESSING DRIVE SECTIONS.
     */
    constructor(@InjectModel(Video.name) private videoModel: Model<Video>, private usersService: UsersService) { }


    private convertLinkToEmbedLink(link: string) {
        const [first, linkId] = link.split('=');
        if (first.includes(YOUTUBE)) {
            return `${YOUTUBE_EMBDED_LINK}/${linkId}`;
        }
        return link;
    }

    async createVideo(createVideoDto: CreateVideoDto): Promise<VideoDocument> {
        Logger.log(`VideosService->createVideo() entered with: ${Utils.toString(createVideoDto)}`);
        const { user, link, ...rest } = createVideoDto;

        const video: Video = {
            ...rest,
            link,
            photoLink: Utils.getYoutubeThumbnail(link).high.url
        }
        const videoDoc = new this.videoModel(video);
        await videoDoc.save();
        Logger.log(`VideosService->createVideo() got: ${Utils.toString(videoDoc)}`);
        await this.usersService.updateUserDto(user);
        return videoDoc;
    }

    async getVideosBySection(videosBySection: VideosBySection): Promise<VideoDocument[]> {
        Logger.log(`VideosService->getVideoBySection() entered with: ${Utils.toString(videosBySection)}`);
        const { section, user: { accessLayer, ...rest } } = videosBySection;
        const videos = await this.videoModel.find({ section, accessLayers: { "$in": [accessLayer] } });
        if (!videos.length) {
            throw new NotFoundException([], `Not videos found`);
        }
        Logger.log(`VideosService->getVideoBySection() got: ${Utils.toString(videos)}`);
        await this.usersService.updateUserDto({ accessLayer, ...rest });
        return videos;
    }

    async updateVideo(updateVideoDto: UpdateVideoDto): Promise<VideoDocument> {
        Logger.log(`VideosService->updateVideo() entered with: ${Utils.toString(updateVideoDto)}`);
        const { videoId, user } = updateVideoDto;
        let updatedVideo = await this.videoModel.findByIdAndUpdate(videoId, updateVideoDto);
        if (!updatedVideo) {
            throw new NotFoundException(`Not video found`);
        }
        Logger.log(`VideosService->updateVideo() got: ${Utils.toString(updatedVideo)}`);
        Object.entries(updateVideoDto).forEach(([key, value]) => {
            if (key !== "user" && value) updatedVideo[key] = value;
        })

        await this.usersService.updateUserDto(user);
        return updatedVideo;
    }

    async deleteVideo(videoId: Types.ObjectId): Promise<VideoDocument> {
        Logger.log(`VideosService->deleteVideo() entered with: ${Utils.toString(videoId)}`);
        let deletedId = await this.videoModel.findByIdAndDelete(videoId);
        Logger.log(`VideosService->deleteVideo() got: ${Utils.toString(deletedId)}`);
        return deletedId;
    }


}
