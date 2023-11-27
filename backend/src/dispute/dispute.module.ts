import { Module } from '@nestjs/common';
import { StripeService } from 'src/stripe/stripe.service';
import { DisputeService } from './dispute.service';
import { DisputeController } from './dispute.controller';

@Module({
  imports: [],
  controllers: [DisputeController],
  providers: [DisputeService, StripeService],
})
export class DisputeModule {}
