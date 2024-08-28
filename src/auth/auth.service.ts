import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto} from './dto/auth.dto';
import {Users} from './dto/credential.dto'
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: AuthDto) {
    // Check if the user already exists
    const exist = await this.prisma.data.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (exist) {
      throw new ForbiddenException('User already exists');
    }

    // Hash the password
    const hash = await bcrypt.hash(dto.password, 10);

    // Create the new user
    const user = await this.prisma.data.create({
      data: {
        name: dto.name,
        email: dto.email,
      password : hash,
      },
    });
    delete user.password

    return {
        message:"user signed up",
        user:user}; 
  }
   async signin(dto:Users){
    const user= await this.prisma.data.findUnique({
      where:{
        email:dto.email
      }
    })
    //checking if user exists
    if(!user){
      throw new UnauthorizedException("user not found")
    }
    const passwordMatches= await bcrypt.compare(dto.password,user.password)
    //password validation
    if(!passwordMatches){
      throw new ForbiddenException("wrong password")

    }
    delete user.password
    return user
    //jwt token
  }
}















