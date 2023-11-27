import { Module } from '@nestjs/common';
import { StripeService } from 'src/stripe/stripe.service';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';

@Module({
  imports: [],
  controllers: [TransactionController],
  providers: [TransactionService, StripeService],
})
export class TransactionModule {}
