import { IsNotEmpty, MaxLength } from "class-validator";
import { PASSWORD_LENGTH } from "src/constants/constants";

export class ResetPasswordDto {

    @IsNotEmpty()
    @MaxLength(PASSWORD_LENGTH)
    password: string;

    @IsNotEmpty()
    resetToken: string;
}
