import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from 'src/schemas/transaction';
import { User } from 'src/schemas/user';
import { StripeService } from 'src/stripe/stripe.service';
import { Web3Service } from 'src/web3/web3.service';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
    private stripeService: StripeService,
    private web3Service: Web3Service,
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

    const data = event.data.object;
    const user = await this.userModel
      .findOne({ cardholderId: data.cardholder })
      .exec();
    if (!user?.wallet) return false;
    const amount = data.pending_request.amount;
    const currency = data.pending_request.currency;
    const userBalance = await this.web3Service.getBalance(
      user.wallet,
      currency,
    );

    if (event.type === 'issuing_authorization.created') {
      if (userBalance < amount) return false;
      await this.web3Service.acquireHold(user.wallet, currency, amount);
      return true;
    } else if (
      event.type === 'issuing_authorization.updated' &&
      data.pending_request.amount === 0
    ) {
      await this.web3Service.releaseHold(user.wallet, currency, amount);
    }

    //await this.web3Service.acquireHold(user.wallet, currency, amount);
    /** 
       * @todo implement it
        Accountant contract -> holds[user] >= refund amount
        -> if yes -> release hold
        -> if not -> open refund request
      */

    return false;
  }
}
