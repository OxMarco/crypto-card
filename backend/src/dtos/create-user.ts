import { Transform } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsUrl,
  IsNotEmpty,
  IsDate,
  IsAlpha,
  IsMobilePhone,
  IsEmail,
  Matches,
  IsAlphanumeric,
  MaxDate,
  IsStrongPassword,
  IsEthereumAddress,
} from 'class-validator';

const eighteenYearsAgo = new Date();
eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEthereumAddress()
  @IsNotEmpty()
  ethereumAddress: string;

  @IsUrl()
  @IsOptional()
  avatar?: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MaxDate(eighteenYearsAgo, {
    message:
      'dob must be a Date instance representing a date at least 18 years ago',
  })
  @IsDate()
  dob: Date;

  @IsEmail()
  email: string;

  @IsMobilePhone()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsAlpha()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}$/, {
    message: 'The countryCode must be a two-letter string',
  })
  countryCode: string;

  @IsString()
  @IsNotEmpty()
  poBox: string;
}
