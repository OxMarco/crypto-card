import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from 'src/dtos/create-user';
import { UpdateUserDto } from 'src/dtos/update-user';
import { StripeService } from 'src/stripe/stripe.service';
import { User } from 'src/schemas/user';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private stripeService: StripeService,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException({ error: 'User not found' });

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // @todo validate signature
  
    const cardholder = await this.stripeService.createCardholder({
      name: createUserDto.firstName + ' ' + createUserDto.lastName,
      email: createUserDto.email,
      phone_number: createUserDto.phone,
      status: 'active',
      type: 'individual',
      individual: {
        first_name: createUserDto.firstName,
        last_name: createUserDto.lastName,
        dob: {
          day: createUserDto.dob.getDate(),
          month: createUserDto.dob.getMonth() + 1, // Gets the month (0-11, +1 to adjust to 1-12)
          year: createUserDto.dob.getFullYear(),
        },
      },
      billing: {
        address: {
          line1: createUserDto.address,
          city: createUserDto.city,
          postal_code: createUserDto.poBox,
          country: createUserDto.countryCode,
        },
      },
    });

    const newCardholder = new this.userModel({
      cardholderId: cardholder.id,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      phone: createUserDto.phone,
      wallet: createUserDto.wallet,
      signature: createUserDto.signature,
    });
    return await newCardholder.save();
  }

  async update(updateUserDto: UpdateUserDto): Promise<User> {
    const cardholder = await this.stripeService.updateCardholder(
      updateUserDto.id,
      updateUserDto,
    );

    const updatedUser = await this.userModel
      .findByIdAndUpdate(updateUserDto.id, { ...cardholder }, { new: true })
      .exec();
    if (!updatedUser) throw new NotFoundException({ error: 'User not found' });

    return updatedUser;
  }
}
