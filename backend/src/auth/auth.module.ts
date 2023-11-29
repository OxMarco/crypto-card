import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StripeService } from 'src/stripe/stripe.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [

  ],
  controllers: [AuthController],
  providers: [AuthService, StripeService]
})
export class AuthModule { }
