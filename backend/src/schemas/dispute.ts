import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DisputeDocument = HydratedDocument<Dispute>;

@Schema({ timestamps: true })
export class Dispute {
  @Prop({ required: true, index: true })
  cardholderId: string;

  @Prop({ required: true, index: true })
  transactionId: string;

  @Prop({ required: true, index: true })
  disputeId: string;
}

export const DisputeSchema = SchemaFactory.createForClass(Dispute);
