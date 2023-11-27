import { Injectable, NotFoundException } from '@nestjs/common';
import { DisputeEntity } from 'src/entities/dispute';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class DisputeService {
  constructor(private stripeService: StripeService) {}

  _parseDispute(dispute: any): DisputeEntity {
    if (!dispute)
      throw new NotFoundException({
        error: `Dispute not found`,
      });
    console.log(dispute);

    const disputeEntity = new DisputeEntity();
    disputeEntity.id = dispute.id;
    disputeEntity.transactionId = dispute.transaction;
    disputeEntity.amount = dispute.amount;
    disputeEntity.currency = dispute.currency;
    disputeEntity.evidence = dispute.evidence;
    disputeEntity.status = dispute.status;
    disputeEntity.createdAt = dispute.created;
    return disputeEntity;
  }

  async getAll(): Promise<DisputeEntity[]> {
    const dispute = await this.stripeService.getAllDisputes();
    return dispute.data.map((dispute) => {
      return this._parseDispute(dispute);
    });
  }

  async getById(id: string): Promise<DisputeEntity> {
    const dispute = await this.stripeService.searchDispute(id);
    return this._parseDispute(dispute);
  }

  async create(createDisputeDto: any): Promise<DisputeEntity> {
    const dispute = await this.stripeService.createDispute(createDisputeDto);
    return this._parseDispute(dispute);
  }
}
