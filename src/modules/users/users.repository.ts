import { Injectable } from '@nestjs/common';
import { Prisma, Status } from '@prisma/client';

import { DatabaseService } from '@core/database/database.service';
import {
  ActionResult,
  ACTION_FAILURE_REASON,
  actionResult,
} from '@core/utils/action-result/action-result';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findOne<P extends Prisma.UserSelect>(
    id: string,
    select: P,
  ): Promise<ActionResult<Prisma.UserGetPayload<{ select: P }>>> {
    const user = await this.databaseService.user.findUnique({
      where: {
        id,
        status: {
          not: Status.DISABLED,
        },
      },
      select,
    });

    if (!user) {
      return actionResult.error(ACTION_FAILURE_REASON.USER_NOT_FOUND);
    }

    return actionResult.ok(user);
  }

  async findByEmail<P extends Prisma.UserSelect>(
    email: string,
    select: P,
  ): Promise<ActionResult<Prisma.UserGetPayload<{ select: P }>>> {
    const user = await this.databaseService.user.findUnique({
      where: {
        email,
        status: {
          not: Status.DISABLED,
        },
      },
      select,
    });

    if (!user) {
      return actionResult.error(ACTION_FAILURE_REASON.USER_NOT_FOUND);
    }

    return actionResult.ok(user);
  }

  async findMany<P extends Prisma.UserSelect>(
    page: number,
    limit: number,
    select: P,
  ): Promise<ActionResult<Prisma.UserGetPayload<{ select: P }>[]>> {
    const users = await this.databaseService.user.findMany({
      where: {
        status: {
          not: Status.DISABLED,
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      select,
    });

    return actionResult.ok(users);
  }

  async remove(
    id: string,
  ): Promise<ActionResult<{ id: string; status: Status }>> {
    const user = await this.findOne(id, { id: true });
    if (!user.ok) return user;

    return actionResult.ok(
      await this.databaseService.user.update({
        where: {
          id,
        },
        data: {
          status: Status.DISABLED,
        },
        select: {
          id: true,
          status: true,
        },
      }),
    );
  }

  async update(
    id: string,
    data: UpdateUserDto,
  ): Promise<ActionResult<UserDto>> {
    if (data.email) {
      const users = await this.databaseService.user.findMany({
        where: {
          OR: [
            {
              email: data.email,
            },
            {
              id,
            },
          ],
        },
      });

      const self = users.find((u) => u.id === id);
      const emailOwner = users.find((u) => u.email === data.email);

      if (!self) {
        return actionResult.error(ACTION_FAILURE_REASON.USER_NOT_FOUND);
      }
      if (emailOwner && emailOwner.id !== id) {
        return actionResult.error(ACTION_FAILURE_REASON.EMAIL_ALREADY_IN_USE);
      }
    } else {
      const user = await this.findOne(id, { id: true });
      if (!user.ok) return user;
    }

    return actionResult.ok(
      await this.databaseService.user.update({
        where: { id },
        data,
      }),
    );
  }

  async create(data: CreateUserDto): Promise<ActionResult<UserDto>> {
    const exists = await this.existsByEmail(data.email);

    if (exists) {
      return actionResult.error(ACTION_FAILURE_REASON.USER_ALREADY_EXISTS);
    }

    return actionResult.ok(await this.databaseService.user.create({ data }));
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.databaseService.user.findUnique({
      where: { email, status: { not: Status.DISABLED } },
      select: { id: true },
    });
    return !!user;
  }
}
