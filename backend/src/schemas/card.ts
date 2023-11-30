import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CardDocument = HydratedDocument<Card>;

@Schema({ timestamps: true })
export class Card {
  @Prop({ required: true, index: true })
  cardId: string;

  @Prop({ required: true, index: true })
  cardholderId: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  currency: string;

  @Prop({ required: true })
  expMonth: number;

  @Prop({ required: true })
  expYear: number;

  @Prop({ required: true })
  last4: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  status: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
