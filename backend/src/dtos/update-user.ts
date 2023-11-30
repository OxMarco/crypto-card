import {
  IsAlpha,
  IsEmail,
  IsEthereumAddress,
  IsMobilePhone,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsEthereumAddress()
  @IsOptional()
  wallet?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsMobilePhone()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsAlpha()
  @Matches(/^[A-Z]{2}$/, {
    message: 'The countryCode must be a two-letter string',
  })
  @IsOptional()
  countryCode?: string;

  @IsString()
  @IsOptional()
  poBox?: string;
}
