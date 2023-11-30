import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/create-user';
import { UserEntity } from 'src/entities/user';
import { UpdateUserDto } from 'src/dtos/update-user';
import { MongooseClassSerializerInterceptor } from 'src/interceptors/mongoose';
import { PaginationInterceptor } from 'src/interceptors/pagination';
import { Public } from 'src/decorators/public';

@Controller('user')
@ApiTags('user')
@MongooseClassSerializerInterceptor(UserEntity)
@UseInterceptors(PaginationInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    type: [UserEntity],
  })
  @Get()
  async getAllUsers() {
    return await this.userService.getAll();
  }

  @ApiOperation({ summary: 'Get a specific user' })
  @ApiResponse({
    status: 200,
    type: UserEntity,
  })
  @Get('/get/:id')
  async getById(@Param('id') id: string) {
    return await this.userService.getById(id);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 200,
    type: UserEntity,
  })
  @Public()
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({
    status: 200,
    type: UserEntity,
  })
  @Put()
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    return await this.userService.update(updateUserDto);
  }
}
