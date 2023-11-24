
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 70;
export const MAX_PHONE_LENGTH = 12;
export const PASSWORD_LENGTH = 24;


export const BCRYPT_ROUNDS = 10;


export const GLOBAL_PREFIX = "backend";


export const ISRAELI_PHONE_REGEX = /^(\+972|0)([23489]|5[012345689]|77)[1-9]\d{6}$/;


export const UnauthorizedExceptionText = "User isn't allowed to continue";


export const LOGIN_REGISTER_MESSAGE = "Successed to entrance to web";

export const YOUTUBE = "youtube";
export const YOUTUBE_EMBDED_LINK = "https://www.youtube.com/embed";


export const SHEETS_CONTANT = '1xHKDtb5D-pD3z8ptbiOcY7bOBtuvYCHEYDwk28OvFDA';

export const MOMENTUM_MAIL_EMAIL = "Office@momentumc.co.il";
export const MOMENTUM_MAIL_PASSWORD = "QweQwe123123#";

export const RAND_TOKEN_SIZE = 20;

export const SECRET_KEY = "secretKey";
export const TIME = {
    SECOND: 1,
    MINUTE: 60,
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
export const MOMENTUM_GMAIL_ACCESS_TOKEN = "ya29.a0AfB_byA7DlxIWU2CvmSiYDAT9kzXxiztlMKX9Mi6RxSHPhBuP_LiZcETMqsSEN6da2lJlQ1euz_PO8El-Ivzi8R3iyKYwflNM8wO6JaJHCaNgZ1oPTtfykb0GC3mw40rTHu-3xOG3h8TqJUdCbBW_8uSk_90ZMGA6USfaCgYKAZESARMSFQHGX2Mia_UHOeZvTeTRRHuaBDfUOQ0171";


export const SHEETS_DRIVE_CLIENT_ID = "222522486064-cm54jgoebejna3d6v6l8apbfrhlk30fh.apps.googleusercontent.com";
export const SHEETS_DRIVE_CLIENT_SECRET = "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";
export const SHEET_DRIVE_EMAIL = "matanhaimguy@gmail.com";

export const SPREAD_SHEET_FORM = "Listing_Research spreadsheet form";
export const ORDER_SHEET_FORM = "Order Sheet";