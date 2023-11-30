import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Dispute } from 'src/schemas/dispute';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class DisputeService {
  constructor(
    @InjectModel(Dispute.name) private disputeModel: Model<Dispute>,
    private stripeService: StripeService,
  ) {}

  async getAll(): Promise<Dispute[]> {
    return await this.disputeModel.find().exec();
  }

  async getById(id: string): Promise<Dispute> {
    const dispute = await this.disputeModel.findById(id).exec();
    if (!dispute) throw new NotFoundException({ error: 'Dispute not found' });

    return dispute;
  }

  async create(createDisputeDto: any): Promise<Dispute> {
    const dispute = await this.stripeService.createDispute(createDisputeDto);
    const newDispute = new this.disputeModel({
      ...dispute,
    });
    return await newDispute.save();
  }
}
