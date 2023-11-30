import {
  IsEthereumAddress,
  IsJSON,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class LoginUserDto {
  @IsEthereumAddress()
  @IsNotEmpty()
  wallet: string;

  @IsJSON()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  signature: string;
}
