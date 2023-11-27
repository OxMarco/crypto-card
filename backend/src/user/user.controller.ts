import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/dtos/create-user';
import { UserEntity } from 'src/entities/user';
import { UpdateUserDto } from 'src/dtos/update-user';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    type: [UserEntity],
  })
  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    return await this.userService.getAll();
  }

  @ApiOperation({ summary: 'Get a specific user' })
  @ApiResponse({
    status: 200,
    type: UserEntity,
  })
  @Get('/get/:id')
  async getById(@Param('id') id: string): Promise<UserEntity> {
    return await this.userService.getById(id);
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 200,
    type: UserEntity,
  })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Update an existing user' })
  @ApiResponse({
    status: 200,
    type: UserEntity,
  })
  @Put()
  async updateUser(@Body() updateUserDto: UpdateUserDto): Promise<UserEntity> {
    return await this.userService.update(updateUserDto);
  }
}
