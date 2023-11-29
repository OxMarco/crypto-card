import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StripeService } from 'src/stripe/stripe.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { SessionSeriallizer } from './session.seriliazer';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ session: true }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, StripeService, SessionSeriallizer],
})
export class AuthModule { }
