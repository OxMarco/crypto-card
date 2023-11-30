import { Injectable, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { LoginUserDto } from 'src/dtos/login-user';
import { StripeService } from 'src/stripe/stripe.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private stripeService: StripeService, private readonly usersService: UserService) { }

  // async login(loginUserDto: LoginUserDto): Promise<any> {
  //   const cardholders = await this.stripeService.getAllCardholders();
  //   for (const cardholder of cardholders.data) {
  //     if (cardholder.metadata?.ethereumAddress === loginUserDto.ethereumAddress) {
  //       const payload = { cardholderId: cardholder.id, ethereumAddress: cardholder.metadata.username };
  //       return {
  //         userId: cardholder.id,
  //         ethereumAddress: cardholder.metadata.ethereumAddress
  //       };
  //     } else {
  //       throw new NotAcceptableException('Could not find this user');
  //     }
  //   }

  //   throw new UnauthorizedException();
  // }
  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.usersService.getById(loginUserDto.ethereumAddress);
    if (!user) {
      throw new NotAcceptableException('could not find the user');
    }
    if (user) {
      return {
        userId: user.id,
        userName: user.ethereumAddress,
        firstName: user.firstName,
        lastName: user.lastNamee,
        email: user.email,
        avatar: user.avatar
      };
    }
    return null;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
