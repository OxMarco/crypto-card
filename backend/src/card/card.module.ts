import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeService } from 'src/stripe/stripe.service';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card, CardSchema } from 'src/schemas/card';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
  ],
  controllers: [CardController],
  providers: [CardService, StripeService],
})
export class CardModule {}
