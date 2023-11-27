import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private webhookSecret: string;

  constructor(private configService: ConfigService) {
    this.stripe = new Stripe(
      configService.get<string>('STRIPE_SECRET_KEY') || '',
    );
    this.webhookSecret =
      this.configService.get<string>('STRIPE_WEBHOOK_SECRET') || '';
  }

  ////////// CARDHOLDERS //////////
  async getAllCardholders() {
    return await this.stripe.issuing.cardholders.list();
  }

  async searchCardholder(params: any) {
    return await this.stripe.issuing.cardholders.retrieve(params);
  }

  async createCardholder(params: Stripe.Issuing.CardholderCreateParams) {
    return await this.stripe.issuing.cardholders.create(params);
  }

  async updateCardholder(id: string, params: any) {
    return await this.stripe.issuing.cardholders.update(id, params);
  }

  ////////// CARDS //////////
  async getAllCards() {
    return await this.stripe.issuing.cards.list();
  }

  async searchCard(params: any) {
    return await this.stripe.issuing.cards.retrieve(params);
  }

  async createCard(params: any) {
    return await this.stripe.issuing.cards.create(params);
  }

  async updateCard(id: string, params: any) {
    return await this.stripe.issuing.cards.update(id, params);
  }

  ////////// TRANSACTIONS //////////
  async getAllTransactions() {
    return await this.stripe.issuing.transactions.list();
  }

  async searchTransaction(params: any) {
    return await this.stripe.issuing.transactions.retrieve(params);
  }

  ////////// AUTHORISATION //////////
  async getAllAuthorisations() {
    return await this.stripe.issuing.authorizations.list();
  }

  async searchAuthorisation(params: any) {
    return await this.stripe.issuing.authorizations.retrieve(params);
  }

  async processAuthorisation(id: string, approve: boolean, params: any) {
    if(approve)
      return await this.stripe.issuing.authorizations.approve(id, params);
    else
      return await this.stripe.issuing.authorizations.decline(id, params);
  }

  ////////// DISPUTES //////////
  async getAllDisputes() {
    return await this.stripe.issuing.disputes.list();
  }

  async searchDispute(params: any) {
    return await this.stripe.issuing.disputes.retrieve(params);
  }

  async createDispute(params: any) {
    return await this.stripe.issuing.disputes.create(params);
  }

  async submitDispute(id: string, params: any) {
    return await this.stripe.issuing.disputes.submit(id, params);
  }

  ////////// WEBHOOKS //////////
  async constructEvent(requestBody: any, signature: any): Promise<Stripe.Event> {
    return this.stripe.webhooks.constructEvent(
      requestBody,
      signature,
      this.webhookSecret,
    );
  }
}
