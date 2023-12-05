import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeService } from 'src/stripe/stripe.service';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction, TransactionSchema } from 'src/schemas/transaction';
import { User, UserSchema } from 'src/schemas/user';
import { Web3Service } from 'src/web3/web3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, StripeService, Web3Service],
})
export class TransactionModule {}
