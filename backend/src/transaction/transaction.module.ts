import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeService } from 'src/stripe/stripe.service';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction, TransactionSchema } from 'src/schemas/transaction';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, StripeService],
})
export class TransactionModule {}
