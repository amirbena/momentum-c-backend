
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 70;
export const MAX_PHONE_LENGTH = 12;


export const ISRAELI_PHONE_REGEX = /^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/;


export enum ACCESS_LAYERS {
    VISITOR = "visitor",
    PAYER = "payer",
    ADMIN = "admin",
    SUPER_ADMIN = "super admin"
}