import { drive_v3 } from "googleapis";

export class IsHasApplication {
    folderId: string;
    name: string;
    files: drive_v3.Schema$File[];
    sheets?: drive_v3.Schema$FileList;
    orderSheetId?: string;
    orderSheetValues?: any[];
    listingResearchId?: string;
    listingResearchValues?: any[];
}