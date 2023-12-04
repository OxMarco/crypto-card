import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from 'src/schemas/transaction';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private stripeService: StripeService,
  ) {}

  async getAll(): Promise<Transaction[]> {
    return await this.transactionModel.find().exec();
  }

  async getById(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction)
      throw new NotFoundException({ error: 'Transaction not found' });

    return transaction;
  }

  async handleWebhook(
    requestBody: Buffer | string | undefined,
    signature: string,
  ): Promise<boolean> {
    let event: any;

    try {
      event = await this.stripeService.constructEvent(requestBody, signature);
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    console.log(event.type);

    if (event.type === 'issuing_authorization.request') {
      const auth = event.data.object;
      /** @todo check user balance on Accountant */
      return true;
    }

    if (event.type === 'issuing_transactions.refund') {
      /** 
       * @todo implement it
        Accountant contract -> holds[user] >= refund amount
        -> if yes -> release hold
        -> if not -> open refund request
      */
    }


    // ...handle other cases
    /** @todo temporary capture -> hold */
    /** @todo issuing_authorization.updated -> increase captured amount */
    /** @todo issuing_authorization.reversal -> decrease captured amount */
    /** @todo send Telegram message */

    return true;
  }
}
