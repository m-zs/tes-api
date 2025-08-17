import { ApiProperty } from '@nestjs/swagger';
import { Role, Status } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
    type: String,
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
    type: String,
    required: true,
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
    type: String,
    required: true,
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
    type: String,
    required: false,
  })
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The role of the user',
    example: Role.USER,
    type: String,
    required: false,
    enum: Role,
  })
  @IsOptional()
  @IsEnum(Role)
  role: Role;

  @ApiProperty({
    description: 'The status of the user',
    example: Status.ACTIVE,
    type: String,
    required: false,
    enum: Status,
  })
  @IsOptional()
  @IsEnum(Status)
  status: Status;
}
