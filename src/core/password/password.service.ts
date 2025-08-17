import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PasswordService {
  constructor(private readonly configService: ConfigService) {}

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(
      password,
      Number(this.configService.get('BCRYPT_SALT_ROUNDS')),
    );
  }

  comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
