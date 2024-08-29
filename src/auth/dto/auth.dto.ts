import { IsEmail, IsNotEmpty, IsString, Matches, matches, MaxLength, MinLength, minLength } from "class-validator"

export  class AuthDto{
    @IsString()
    name:string
    @IsEmail()
    @IsNotEmpty()
    email:string
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*\d)/, { message: 'Password must contain at least one number' })

    password:string
}
export class ChangePassword{
    @IsString()
    oldpassword:string
 
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*\d)/, { message: 'Password must contain at least one number' })

    newpassword:string
}
