import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class AuthService {
  constructor(private stripeService: StripeService) { }

  async login(username: string, password: string): Promise<any> {
    const cardholders = await this.stripeService.getAllCardholders();
    for (const cardholder of cardholders.data) {
      if (cardholder.metadata?.username === username) {
        if (await bcrypt.compare(password, cardholder.metadata.password)) {
          const payload = { cardholderId: cardholder.id, username: cardholder.metadata.username };
          return {

          };
        }
      }
    }

    throw new UnauthorizedException();
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
