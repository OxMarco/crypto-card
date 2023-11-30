import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeService } from 'src/stripe/stripe.service';
import { DisputeService } from './dispute.service';
import { DisputeController } from './dispute.controller';
import { Dispute, DisputeSchema } from 'src/schemas/dispute';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Dispute.name, schema: DisputeSchema }]),
  ],
  controllers: [DisputeController],
  providers: [DisputeService, StripeService],
})
export class DisputeModule {}
