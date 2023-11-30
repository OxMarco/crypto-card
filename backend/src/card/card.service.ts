import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCardDto } from 'src/dtos/create-card';
import { UpdateCardDto } from 'src/dtos/update-card';
import { Card } from 'src/schemas/card';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class CardService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<Card>,
    private stripeService: StripeService,
  ) {}

  async getAll(cardholderId: string): Promise<Card[]> {
    return await this.cardModel.find({ cardholderId }).exec();
  }

  async getById(id: string): Promise<Card> {
    const card = await this.cardModel.findById(id).exec();
    if (!card) throw new NotFoundException({ error: 'Card not found' });

    return card;
  }

  async createCard(cardholderId: string, createCardDto: CreateCardDto): Promise<Card> {
    const user = await this.stripeService.searchCardholder(cardholderId);
    if(!user) throw new NotFoundException({ error: 'User not found' });
    
    let shippingData: any = null;
    if(createCardDto.type === 'physical') {
      shippingData = {
        address: {
          city: user.billing.address.city,
          country: user.billing.address.country,
          line1: user.billing.address.line1,
          postal_code: user.billing.address.postal_code,
        },
        name: user.individual?.first_name + ' ' + user.individual?.last_name,
        phone_number: user.phone_number,
        service: 'standard'
      }

      if (user.billing.address.line2) {
        shippingData.address.line2 = user.billing.address.line2;
      }

      if (user.billing.address.state) {
        shippingData.address.state = user.billing.address.state;
      }
    }
    
    const card = await this.stripeService.createCard({
      cardholder: cardholderId,
      type: createCardDto.type as any,
      currency: createCardDto.currency as any,
      shipping: shippingData
    });

    const newCard = new this.cardModel({
      cardId: card.id,
      cardholderId: card.cardholder.id,
      type: card.type,
      currency: card.currency,
      expMonth: card.exp_month,
      expYear: card.exp_year,
      last4: card.last4,
      brand: "Visas",
      status: card.status,
    });

    return await newCard.save();
  }

  async updateCard(cardholderId: string, updateCardDto: UpdateCardDto): Promise<Card> {
    const updatedCard = await this.cardModel
      .findOneAndUpdate(
          { cardId: updateCardDto.cardId, cardholderId: cardholderId },
          { status: updateCardDto.status },
          { new: true }
      )
      .exec();
    if (!updatedCard) throw new NotFoundException({ error: 'Card not found' });
    await this.stripeService.updateCard(updateCardDto.cardId, { status: updateCardDto.status });

    return updatedCard;
  }
}
