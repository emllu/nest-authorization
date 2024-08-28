import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class Users {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^(?=.*\d)/, { message: 'Password must contain at least one number' })
    password: string;
}
