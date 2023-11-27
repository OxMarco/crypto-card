import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Module({
  providers: [StripeService],
})
export class StripeModule {}
