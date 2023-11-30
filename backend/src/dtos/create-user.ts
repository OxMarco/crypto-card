import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsAlpha,
  IsMobilePhone,
  IsEmail,
  Matches,
  MaxDate,
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
  wallet: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MaxDate(eighteenYearsAgo, {
    message: 'user must be above 18 years old',
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
