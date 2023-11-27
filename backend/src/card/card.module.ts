import { Module } from '@nestjs/common';
import { StripeService } from 'src/stripe/stripe.service';
import { CardService } from './card.service';
import { CardController } from './card.controller';

@Module({
  imports: [],
  controllers: [CardController],
  providers: [CardService, StripeService],
})
export class CardModule {}
