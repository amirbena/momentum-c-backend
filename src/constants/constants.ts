
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 70;
export const MAX_PHONE_LENGTH = 12;
export const PASSWORD_LENGTH = 24;


export const BCRYPT_ROUNDS = 10;


export const GLOBAL_PREFIX= "backend";


export const ISRAELI_PHONE_REGEX = /^(\+972|0)([23489]|5[012345689]|77)[1-9]\d{6}$/;


export const UnauthorizedExceptionText = "User isn't allowed to continue";

export const FOLDER_TO_ADD = "יישום  עמיר המלך";
export const FOLDER_MEDIA_TYPE_DRIVE = "application/vnd.google-apps.folder";

export const LOGIN_REGISTER_MESSAGE = "Successed to entrance to web";

export const YOUTUBE = "youtube";
export const YOUTUBE_EMBDED_LINK = "https://www.youtube.com/embed";


export const SHEETS_CONTANT = '1EPH9vTeakgHbSsWmOpjJ3JlG4RB00fDdG1CheZRR_ds';

export const MOMENTUM_MAIL_EMAIL = "Office@momentumc.co.il";
export const MOMENTUM_MAIL_PASSWORD = "QweQwe123123#";

export const RAND_TOKEN_SIZE = 20;

export const SECRET_KEY = "secretKey";
export const TIME = {
    SECOND: 1,
    MIN: 60,
    HOUR: 60 * 60,
    DAY: 60 * 60 * 24,
    WEEK: 60 * 60 * 24 * 7,
    MONTH: 60 * 60 * 24 * 30,
    YEAR: 60 * 60 * 24 * 365
}
export enum AccessLayer {
    VISITOR = "visitor",
    PAYER_CLIENT = "client",
    EMPLOYEE = "employee",
    ADMIN = "admin",
    SUPER_ADMIN = "super admin"
}

export enum VideoSection {
    General = "general"
}

export enum PopupCreation {
    REGULAR_POPUP = "Successed to create regular popup",
    SCHEDUALING_POPUP = "Successed to create scheduling popup"
}




export const MOMENTUM_GMAIL_CLIENT_ID = "554094100325-ukgn69ol9lk3s2uf2g8ojre5r6e48g97.apps.googleusercontent.com";
export const MOMENTUM_GMAIL_CLIENT_SECRET = "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";
export const REDIRECT_URI = "https://developers.google.com/oauthplayground";
export const MOMENTUM_GMAIL_REFRESH_TOKEN = "1//04dVOGKwOGS0tCgYIARAAGAQSNwF-L9IrBZJwmNfU3D_qkTG3krDyzWkLoxn3iWxGs1NRHZLGxdBB4pttdlSEmC9XqneuNx_U87s";
export const MOMENTUM_GMAIL_ACCESS_TOKEN = "ya29.a0AfB_byDKsXbqsijK5mNSj9OjgUrHHdMktivYRbSfJ9YoKtagrkEYgQvxpecGtSMDARDOyFXSZbCBdOUlQ91JQFoF3ChDhUiWCSCW1hvbKSKGjsWqTGXp9V2R79puBhu5c7Dkcoi8ImpnDN9nJwv-cbNKtc9e_okeOhEKaCgYKAQ0SARMSFQHGX2MiGDOo1y4Is8XlMqqHXOkdnA0171";


export const SHEETS_DRIVE_CLIENT_ID = "222522486064-cm54jgoebejna3d6v6l8apbfrhlk30fh.apps.googleusercontent.com";
export const SHEETS_DRIVE_CLIENT_SECRET = "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";
export const SHEET_DRIVE_EMAIL = "matanhaimguy@gmail.com";