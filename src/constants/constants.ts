
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 70;
export const MAX_PHONE_LENGTH = 12;
export const PASSWORD_LENGTH = 24;


export const BCRYPT_ROUNDS = 10;


export const ISRAELI_PHONE_REGEX = /^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/;


export const UnauthorizedExceptionText= "User isn't allowed to continue";

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
    PAYER = "payer",
    ADMIN = "admin",
    SUPER_ADMIN = "super admin"
}