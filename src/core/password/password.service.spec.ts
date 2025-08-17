import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordService,
        ConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('10'),
          },
        },
      ],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash a password', async () => {
    const password = faker.internet.password({ length: 10 });
    const hashedPassword = await service.hashPassword(password);
    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
  });

  it('should compare a password', async () => {
    const password = faker.internet.password({ length: 10 });
    const hashedPassword = await service.hashPassword(password);
    const isPasswordValid = await service.comparePassword(
      password,
      hashedPassword,
    );
    expect(isPasswordValid).toBe(true);
  });
});
