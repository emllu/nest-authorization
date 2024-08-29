import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto, ChangePassword } from './dto/auth.dto';
import { Users } from './dto/credential.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { RefreshDto, Reset, ResetDto } from './dto';
import { nanoid } from 'nanoid';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

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
        password: hash,
      },
    });
    delete user.password;

    return {
      message: "User signed up",
      user: user,
    };
  }

  async signin(dto: Users) {
    const user = await this.prisma.data.findUnique({
      where: {
        email: dto.email,
      },
    });

    // Check if the user exists
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Password validation
    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      throw new ForbiddenException('Wrong password');
    }

    delete user.password;

    return this.generateAccessToken(user.id);
  }

  async refresh(dto: RefreshDto) {
    // Find the refresh token in the database
    const refresh = await this.prisma.refreshtoken.findFirst({
      where: {
        token: dto.token,
        expiredate: { gte: new Date() }, // Use 'new Date()' to get the current date
      },
    });

    // Check if refresh token is valid
    if (!refresh) {
      throw new UnauthorizedException('User login required');
    }

    // Generate new access and refresh tokens
    // const { accessToken, refreshtoken } =
     await this.generateAccessToken(refresh.userid )

    // Delete the old refresh token
    // await this.prisma.refreshtoken.delete({
    //   where: {
    //     id: refresh.id,
    //   },
    // });

    // return { accessToken, refreshtoken, };
  }

  async generateAccessToken(userId: number) {
    const accessToken = this.jwt.sign({ userId }, { expiresIn: '1h' });
    const refreshtoken = uuidv4();
    await this.storeRefreshToken(refreshtoken, userId);
    return { accessToken, refreshtoken ,userId};
  }

  private async storeRefreshToken(token: string, userId: number) {
    const expiredate = new Date();
    expiredate.setDate(expiredate.getDate() + 3); // Set expiration to 3 days from now

   await this.prisma.refreshtoken.upsert({
      where: { userid: userId }, // Criteria to find the record
      update: {
        token: token,
        expiredate: expiredate,
      },
      create: {
        userid: userId,
        token: token,
        expiredate: expiredate,
      },
    });
  }
  //change password
  async changepassword(dto:ChangePassword,userid:number){
    //checking if user exists
    const user= await this.prisma.data.findFirst({
      where:{
id:userid
        
      }
    })
    if(!user){
      throw new UnauthorizedException("user is not signed up yet pls sign in for change p")
    }
    //checking the old password
    const passwordmatching= await bcrypt.compare(dto.oldpassword,user.password)
    if(!passwordmatching){
      throw new ForbiddenException("write correct password for change")
    }
    //changing the new password
    const hash= await bcrypt.hash(dto.newpassword,10 )
    await this.prisma.data.update({
      data:{
       password:hash
      }
      ,where:{
id:userid
      }
    })
    return {msg:"password changed successfully"}
  }
  //forgot password
async forgotpassword(dto:ResetDto){
  //checking if user exist
  const user=await this.prisma.data.findFirst({
    where:{
      email:dto.email
    }
  }) 
  if(user){
 const resettoken= uuidv4()
 const expiredate=new Date()
 expiredate.setHours(expiredate.getHours()+1)
 await this.prisma.resettoken.create({
  data:{
    token:resettoken,
    userid:user.id,
    expiredate:expiredate
  }

 })
 return { reseturl:`http://localhost:3000/auth/reset-password:${resettoken}`}
  }
else{
  return "you will recive in your email"
}
 
}
//reset-password

 async resetpassword(dto: Reset) {
  // Check if the token exists and is not expired
  const token = await this.prisma.resettoken.findFirst({
    where: {
      token: dto.token,
      expiredate: { gte: new Date() }, // Token must not be expired
    },
  });

  if (!token) {
    throw new ForbiddenException('Invalid token');
  }

  // Check if the user exists
  const user = await this.prisma.data.findFirst({
    where: {
      id: token.userid,
    },
  });

  if (!user) {
    throw new UnauthorizedException('Invalid user for reset password');
  }

  // Hash the new password
  const hash = await bcrypt.hash(dto.password, 10);

  // Update the user's password
  await this.prisma.data.update({
    where: {
      id: user.id,
    },
    data: {
      password: hash,
    },
  });

  // Delete the entire row from the resettoken table
  await this.prisma.resettoken.delete({
    where: {
      userid:token.id , // Specify the token to delete the entire row
    },
  });

  return { message: "Password changed and reset token deleted" };
 }


}


















