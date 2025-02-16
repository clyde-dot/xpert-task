import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      omit: { user: { password: true, hashedToken: true } },
    });
  }

  async onModuleInit() {
    await this.$connect();
    console.log(`Prisma connection opened`);
  }
  async onModuleDestroy() {
    await this.$disconnect();
    console.log(`Prisma connection closed`);
  }
}
