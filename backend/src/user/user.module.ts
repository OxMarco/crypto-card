import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { StripeService } from 'src/stripe/stripe.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './users.model';

@Module({
  imports: [MongooseModule.forFeature([
    {
      name: "user",
      schema: UserSchema
    }
  ])],
  controllers: [UserController],
  providers: [UserService, StripeService],
  exports: [UserService]
})
export class UserModule { }
