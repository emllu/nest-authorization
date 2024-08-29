import { Module, UseGuards } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth/auth.guard';

@Module({
  imports: [AuthModule, PrismaModule,JwtModule.register({
    global:true,
    secret:'i am 10'
  })],

 
})
export class AppModule {}
