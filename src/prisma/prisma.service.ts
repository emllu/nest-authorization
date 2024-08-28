import { Global, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService  extends PrismaClient{
    constructor(){
      super({
        datasources:{
          db:{
            url:"mysql://root:emluti1234@localhost:3306/nestcrud"

          }
        }
      })
    }
}