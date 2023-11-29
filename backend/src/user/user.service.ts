import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dtos/create-user';
import { UpdateUserDto } from 'src/dtos/update-user';
import { StripeService } from 'src/stripe/stripe.service';
import { UserEntity } from 'src/entities/user';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.model';

@Injectable()
export class UserService {
  constructor(private stripeService: StripeService, @InjectModel('user') private readonly userModel: Model<User>) { }

  _parseUser(cardholder: any): UserEntity {
    if (!cardholder)
      throw new NotFoundException({
        error: `User not found`,
      });

    const userEntity = new UserEntity();
    // userEntity.id = cardholder.id;
    userEntity.ethereumAddress = cardholder.metadata.ethereumAddress;
    // userEntity.avatar = cardholder.metadata.username;
    // userEntity.firstName = cardholder.individual?.first_name || undefined;
    // userEntity.lastName = cardholder.individual?.last_name || undefined;
    // userEntity.phone = cardholder.phone_number || undefined;
    // userEntity.email = cardholder.email || undefined;
    // userEntity.status = cardholder.status;
    // userEntity.createdAt = cardholder.created;
    return userEntity;
  }

  async getAll(): Promise<UserEntity[]> {
    const cardholders = await this.stripeService.getAllCardholders();
    return cardholders.data.map((cardholder) => {
      return this._parseUser(cardholder);
    });
  }

  // async getById(id: string): Promise<UserEntity> {
  //   const cardholder = await this.stripeService.searchCardholder(id);
  //   return this._parseUser(cardholder);
  // }

  async getById(id: string) {
    const ethereumAddress = id.toLowerCase()
    const user = await this.userModel.findOne({ ethereumAddress })

    return user;
  }

  // async create(createUserDto: CreateUserDto): Promise<UserEntity> {
  //   const pass = await bcrypt.hash(createUserDto.password, 10);
  //   const cardholder = await this.stripeService.createCardholder({
  //     name: createUserDto.firstName + ' ' + createUserDto.lastName,
  //     email: createUserDto.email,
  //     phone_number: createUserDto.phone,
  //     status: 'active',
  //     type: 'individual',
  //     individual: {
  //       first_name: createUserDto.firstName,
  //       last_name: createUserDto.lastName,
  //       dob: {
  //         day: createUserDto.dob.getDate(),
  //         month: createUserDto.dob.getMonth() + 1, // Gets the month (0-11, +1 to adjust to 1-12)
  //         year: createUserDto.dob.getFullYear(),
  //       },
  //     },
  //     billing: {
  //       address: {
  //         line1: createUserDto.address,
  //         city: createUserDto.city,
  //         postal_code: createUserDto.poBox,
  //         country: createUserDto.countryCode,
  //       },
  //     },
  //     metadata: {
  //       username: createUserDto.username,
  //       password: pass,
  //       avatar: createUserDto?.avatar || '',
  //     },
  //   });

  //   return this._parseUser(cardholder);
  // }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser = new this.userModel(createUserDto)

    await newUser.save();
    return newUser;
  }

  async update(updateUserDto: UpdateUserDto): Promise<UserEntity> {
    const cardholder = await this.stripeService.updateCardholder(
      updateUserDto.id,
      updateUserDto,
    );
    return this._parseUser(cardholder);
  }
}
