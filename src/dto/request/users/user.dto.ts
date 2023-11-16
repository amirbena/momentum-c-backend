import { IsEmail, IsNotEmpty, Matches, MaxLength } from "class-validator";
import { ISRAELI_PHONE_REGEX, MAX_EMAIL_LENGTH, MAX_NAME_LENGTH, MAX_PHONE_LENGTH, PASSWORD_LENGTH } from "src/constants/constants";

export class UserDto {

    @IsNotEmpty()
    @MaxLength(MAX_NAME_LENGTH)
    fullName: string;

    @IsNotEmpty()
    @MaxLength(MAX_PHONE_LENGTH)
    @Matches(ISRAELI_PHONE_REGEX)
    phoneNumber: string;

    @IsNotEmpty()
    @MaxLength(MAX_EMAIL_LENGTH)
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MaxLength(PASSWORD_LENGTH)
    password: string;
}
