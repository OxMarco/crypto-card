import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StripeService } from 'src/stripe/stripe.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService, StripeService],
})
export class UserModule {}
