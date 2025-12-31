import { Test, TestingModule } from '@nestjs/testing';
import { UUID_REGEX } from '@/tests/utils';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      password: 'password',
      passwordConfirmation: 'password',
    };

    const user = await service.createLocalUser(createUserDto);
    expect(user).toBeDefined();
    expect(user).toMatch(UUID_REGEX);
  });
});
