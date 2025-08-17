import { PickType } from '@nestjs/swagger';

import { UserEntity } from '../entities/user.entity';

export class UserDto extends PickType(UserEntity, [
  'id',
  'email',
  'firstName',
  'lastName',
]) {}
