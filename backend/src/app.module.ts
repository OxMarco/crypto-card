import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { StripeModule } from './stripe/stripe.module';
import { CardModule } from './card/card.module';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { DisputeModule } from './dispute/dispute.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    UserModule,
    StripeModule,
    CardModule,
    TransactionModule,
    DisputeModule,
    AuthModule,
    MongooseModule.forRoot(
      'mongodb://localhost:27017/crypto-card'
    )
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
