import { Injectable } from '@nestjs/common';
import { Role, Status } from '@prisma/client';

import { PasswordService } from '@core/password/password.service';
import { unwrapActionResult } from '@core/utils/action-result/action-result';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    const data = {
      ...createUserDto,
    };

    if (!createUserDto.status) {
      data.status = Status.ACTIVE;
    }

    if (createUserDto.password) {
      data.password = await this.passwordService.hashPassword(
        createUserDto.password,
      );
    } else {
      // TODO: invitation email
    }

    if (!createUserDto.role) {
      data.role = Role.USER;
    }

    return unwrapActionResult(await this.usersRepository.create(data));
  }

  async findMany(page: number, limit: number): Promise<UserDto[]> {
    return unwrapActionResult<UserDto[]>(
      await this.usersRepository.findMany(page, limit, {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      }),
    );
  }

  async findOne(id: string): Promise<UserDto> {
    return unwrapActionResult<UserDto>(
      await this.usersRepository.findOne(id, {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      }),
    );
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    const data = {
      ...updateUserDto,
    };

    if (updateUserDto.password) {
      data.password = await this.passwordService.hashPassword(
        updateUserDto.password,
      );
    }

    return unwrapActionResult(await this.usersRepository.update(id, data));
  }

  async remove(id: string): Promise<{ id: string; status: Status }> {
    return unwrapActionResult(await this.usersRepository.remove(id));
  }
}
