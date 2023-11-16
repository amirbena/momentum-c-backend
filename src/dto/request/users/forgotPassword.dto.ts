import { IsEmail, IsIn, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsIn(["English", "Hebrew"])
    language: string;
}