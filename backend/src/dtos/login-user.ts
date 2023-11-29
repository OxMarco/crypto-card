import { IsEthereumAddress, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEthereumAddress()
  ethereumAddress: string;
}
