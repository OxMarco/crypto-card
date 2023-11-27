import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionEntity } from 'src/entities/transaction';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class TransactionService {
  constructor(private stripeService: StripeService) {}

  _parseTransaction(transaction: any): TransactionEntity {
    if (!transaction)
      throw new NotFoundException({
        error: `Transaction not found`,
      });
    console.log(transaction)

    const transactionEntity = new TransactionEntity();
    transactionEntity.id = transaction.id;
    transactionEntity.amount = transaction.amount;
    transactionEntity.cardId = transaction.card;
    transactionEntity.cardholderId = transaction.cardholder;
    transactionEntity.currency = transaction.currency;
    transactionEntity.merchantAmount = transaction.merchant_amount;
    transactionEntity.merchantCurrency = transaction.merchant_currency;
    transactionEntity.merchant = transaction.merchant_data;
    transactionEntity.type = transaction.type;
    transactionEntity.createdAt = transaction.created;
    return transactionEntity;
  }

  async getAll(): Promise<TransactionEntity[]> {
    const transaction = await this.stripeService.getAllTransactions();
    return transaction.data.map((transaction) => {
      return this._parseTransaction(transaction);
    });
  }

  async getById(id: string): Promise<TransactionEntity> {
    const transaction = await this.stripeService.searchTransaction(id);
    return this._parseTransaction(transaction);
  }

  async handleWebhook(requestBody: Buffer | string | undefined, signature: string): Promise<Boolean> {
    let event: any;

    try {
      event = await this.stripeService.constructEvent(
        requestBody,
        signature,
      );
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    console.log(event.type)

    if (event.type === 'issuing_authorization.request') {
      const auth = event.data.object;
      // ... custom business logic
      return true;
    }

    // ...handle other cases

    return true;
  }
}
