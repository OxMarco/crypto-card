import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request } from 'express';
import { Model } from 'mongoose';
import { generateNonce, SiweErrorType, SiweMessage } from 'siwe';
import { LoginUserDto } from 'src/dtos/login-user';
import { User } from 'src/schemas/user';
import { StripeService } from 'src/stripe/stripe.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private stripeService: StripeService,
    private jwtService: JwtService,
  ) {}

  async generateNonce(wallet: string): Promise<any> {
    const user = await this.userModel.findOne({ wallet }).exec();
    if (!user) throw new UnauthorizedException();

    user.nonce = generateNonce();
    await user.save();

    return user.nonce;
  }

  async login(loginDto: LoginUserDto): Promise<any> {
    const user = await this.userModel
      .findOne({ wallet: loginDto.wallet })
      .exec();
    if (!user) throw new UnauthorizedException({ error: 'User not found' });
    const cardholder = await this.stripeService.searchCardholder(
      user.cardholderId,
    );
    if (cardholder.status !== 'active')
      throw new UnauthorizedException({ error: 'Inactive user' });

      try {
      const SIWEObject = new SiweMessage(JSON.parse(loginDto.message));
      const { data: msg } = await SIWEObject.verify({
        signature: loginDto.signature,
        nonce: user.nonce,
      });

      return {
        id: user.id, 
        cardholderId: user.cardholderId,
        accessToken: await this.jwtService.signAsync({ id: user.id, cardholderId: user.cardholderId }),
      };
    } catch (e) {
      if (e == SiweErrorType.EXPIRED_MESSAGE) {
        console.log('Expired message');
        throw new UnauthorizedException({ error: 'Expired message' });
      } else if (e == SiweErrorType.INVALID_SIGNATURE) {
        console.log('Invalid signature');
        throw new UnauthorizedException({ error: 'Invalid signature' });
      } else {
        console.log('Unknown error ' + e.message);
        throw new UnauthorizedException({ e });
      }
    }
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
