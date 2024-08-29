import { IsEmail, IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class RefreshDto
{
    @IsNotEmpty()
    @IsString()
    token:string
    
}
export class ResetDto{
    @IsNotEmpty()
    @IsEmail()
    email:string
   
}
export class Reset{
    @IsNotEmpty()
    @IsString()
    token:string
    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*\d)/, { message: 'Password must contain at least one number' })

    password:string

}