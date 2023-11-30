import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ required: true, index: true })
  cardholderId: string;

  @Prop({ required: true, index: true })
  cardId: string;

  @Prop({ required: true, index: true })
  transactionId: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
