import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from 'src/dtos/create-card';
import { CardEntity } from 'src/entities/card';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class CardService {
  constructor(private stripeService: StripeService) {}

  _parseCard(card: any): CardEntity {
    if (!card)
      throw new NotFoundException({
        error: `Card not found`,
      });

    const cardEntity = new CardEntity();
    cardEntity.id = card.id;
    cardEntity.cardholderId = card.cardholder.id;
    cardEntity.currency = card.currency;
    cardEntity.expMonth = card.exp_month;
    cardEntity.expYear = card.exp_year;
    cardEntity.last4 = card.last4;
    cardEntity.brand = card.brand;
    cardEntity.type = card.type;
    cardEntity.status = card.status;
    cardEntity.createdAt = card.created;
    return cardEntity;
  }

  async getAll(): Promise<CardEntity[]> {
    const card = await this.stripeService.getAllCards();
    return card.data.map((card) => {
      return this._parseCard(card);
    });
  }

  async getById(id: string): Promise<CardEntity> {
    const card = await this.stripeService.searchCard(id);
    return this._parseCard(card);
  }

  async createCard(createCardDto: CreateCardDto) {
    const card = await this.stripeService.createCard({
      cardholder: createCardDto.id,
      type: createCardDto.type as any,
      currency: 'eur',
    });

    return this._parseCard(card);
  }

  async updateCard(id: string, params: any) {
    const card = await this.stripeService.updateCard(id, params);

    return this._parseCard(card);
  }
}
