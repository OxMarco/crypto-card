import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StripeService } from 'src/stripe/stripe.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    UserModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, StripeService, LocalStrategy]
})
export class AuthModule { }
