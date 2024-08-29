import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, ChangePassword, RefreshDto, Reset, ResetDto } from './dto';
import { dot } from 'node:test/reporters';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}

    // @UseGuards(AuthGuard)

@Post('signup')
signup(@Body() dto:AuthDto){
return this.authService.signup(dto)
}

@Post('signin')
signin(@Body() dto:AuthDto){
    return this.authService.signin(dto)

}
//refresh token

@Post('refresh')

 refresh(@Body() dto:RefreshDto){
return this.authService.refresh(dto)
    }
 @UseGuards(AuthGuard)
@Post('change-password')
 async changepassword(@Body() dto:ChangePassword,@Req() req)  {
 return   await this.authService.changepassword(dto,req.userId)

} 
@Post('forgot-password') 
 async forgotpassword(@Body() dto:ResetDto){
  return   await this.authService.forgotpassword(dto)

 }
 @Post('reset-password')
 async resetpassword(@Body() dto:Reset){
   return await this.authService.resetpassword(dto)
 }
}
