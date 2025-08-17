import { ApiProperty } from '@nestjs/swagger';
import { Role, Status, User } from '@prisma/client';

export class UserEntity implements User {
  @ApiProperty({
    description: 'The ID of the user',
    example: '123',
  })
  id: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  lastName: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
  })
  role: Role;

  @ApiProperty({
    description: 'The created at date of the user',
    example: '2021-01-01',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The updated at date of the user',
    example: '2021-01-01',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'The status of the user',
    example: 'active',
  })
  status: Status;
}
