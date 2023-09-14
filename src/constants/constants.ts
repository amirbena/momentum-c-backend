
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 70;
export const MAX_PHONE_LENGTH = 12;


export const ISRAELI_PHONE_REGEX = /^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/;


export const SECRET_KEY = "secretKey";
export const TIME = {
    MILLISECOND: 1,
    SECOND: 1000,
    MIN: 1000 * 60,
    HOURS: 1000 * 60 * 60,
    DAY: 1000 * 60 * 60 * 24,
    WEEK: 1000 * 60 * 60 * 24 * 7,
    MONTH: 1000 * 60 * 60 * 24 * 30,
    YEAR: 1000 * 60 * 60 * 24 * 365
}
export enum ACCESS_LAYERS {
    VISITOR = "visitor",
    PAYER = "payer",
    ADMIN = "admin",
    SUPER_ADMIN = "super admin"
}