import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';

import { PaginationDto } from '@core/dto/pagination/pagination.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return await this.usersService.create(createUserDto);
  }

  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'The page number',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'The number of users per page',
  })
  @ApiExtraModels(PaginationDto, UserDto)
  @ApiOkResponse({
    description: 'Users found',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginationDto) },
        {
          properties: {
            items: { type: 'array', $ref: getSchemaPath(UserDto) },
          },
        },
      ],
    },
  })
  @Get()
  async findMany(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<PaginationDto<UserDto>> {
    const users = await this.usersService.findMany(page, limit);

    return {
      items: users,
      page,
      limit,
    };
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The ID of the user',
  })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserDto> {
    return await this.usersService.findOne(id);
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The ID of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'User updated',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return await this.usersService.update(id, updateUserDto);
  }

  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The ID of the user',
  })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.usersService.remove(id);
  }
}
