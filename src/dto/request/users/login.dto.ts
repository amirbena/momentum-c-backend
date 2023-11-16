import { IsEmail, IsNotEmpty, MaxLength } from "class-validator";
import { MAX_EMAIL_LENGTH, PASSWORD_LENGTH } from "src/constants/constants";

export class LoginDto {

    @IsNotEmpty()
    @MaxLength(MAX_EMAIL_LENGTH)
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MaxLength(PASSWORD_LENGTH)
    password: string;
}