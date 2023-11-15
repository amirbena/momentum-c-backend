import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PopupCreation } from 'src/constants/constants';
import { CreateRegularPopup } from 'src/dto/request/popup/createRegularPopup.dto';
import { CreateSchedualingPopup } from 'src/dto/request/popup/createSchedualingPopup.dto';
import { RetreivePopups } from 'src/dto/request/popup/getPopupsToUser.dto';
import { UpdatePopupDto } from 'src/dto/request/popup/updatePopup.dto';
import { CreatePopupResult } from 'src/dto/response/popup/createPopup.result';
import { Popup } from 'src/schemas/popup.schema';
import { UsersService } from 'src/users/users.service';
import { Utils } from 'src/utils/Utils';

@Injectable()
export class PopupService {
    constructor(@InjectModel(Popup.name) private popupModel: Model<Popup>, private userService: UsersService) { }

    async createRegularPopup(createPopupDto: CreateRegularPopup): Promise<CreatePopupResult> {
        Logger.log(`PopupService->createRegularPopup() entered with: ${Utils.toString(createPopupDto)}`);
        const { user, ...popupRef } = createPopupDto;
        const popup: Popup = {
            ...popupRef,
            userReadIds: []
        }

        const popupItem = new this.popupModel(popup);
        await popupItem.save();
        Logger.log(`PopupService->createRegularPopup() got: ${Utils.toString(popupItem)}`);
        await this.userService.updateUserDto(user);
        return { message: PopupCreation.REGULAR_POPUP };
    }

    async createSchedualingPopup(createPopupDto: CreateSchedualingPopup): Promise<CreatePopupResult> {
        Logger.log(`PopupService->createSchedualingPopup() entered with: ${Utils.toString(createPopupDto)}`);
        const { user, ...popupRef } = createPopupDto;
        const popup: Popup = {
            ...popupRef,
            userReadIds: []
        }

        const popupItem = new this.popupModel(popup);
        await popupItem.save();
        Logger.log(`PopupService->createSchedualingPopup() got: ${Utils.toString(popupItem)}`);
        await this.userService.updateUserDto(user);
        return { message: PopupCreation.SCHEDUALING_POPUP };
    }

    async showPopupsAccordingUser(popupToUser: RetreivePopups): Promise<Popup[]> {
        Logger.log(`PopupService->showPopupsAccordingUser() entered with: ${Utils.toString(popupToUser)}`);
        const { dateToCheck, user } = popupToUser;
        const { dateBefore, dateAfter } = Utils.buildDateRangeOfDate(dateToCheck);
        const id = await this.userService.getIdByFullName(user.fullName);
        if (!id) return [];
        const popups = await this.popupModel.find({ $or: [{ creationDate: { $gte: dateBefore, $lte: dateAfter } }, { scheudlingDate: { $lte: dateToCheck } }], userReadIds: { $nin: [id] } });
        Logger.log(`PopupService->showPopupsAccordingUser() got popups, ${Utils.toString(popups)}`);
        return popups;
    }

    async updatePopup(updatePopup: UpdatePopupDto): Promise<void> {
        Logger.log(`PopupService->updatePopup() entered with: ${Utils.toString(updatePopup)}`);
        const { popupId, userId, user } = updatePopup;
        const popup = await this.popupModel.findById(popupId);
        if (!popup) return;
        popup.userReadIds = [...popup.userReadIds, userId];
        await popup.save();
        await this.userService.updateUserDto(user);
        return;
    }
}
