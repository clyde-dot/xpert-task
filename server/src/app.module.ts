import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { TicketModule } from './modules/ticket/ticket.module';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '.env' }), PrismaModule, UserModule, AuthModule, TicketModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
