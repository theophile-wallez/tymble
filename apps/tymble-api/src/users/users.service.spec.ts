import { Test, TestingModule } from '@nestjs/testing';
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
    };

    const user = await service.create(createUserDto);
    expect(user).toHaveProperty('id');
    expect(user.firstName).toBe(createUserDto.firstName);
    expect(user.lastName).toBe(createUserDto.lastName);
    expect(user.email).toBe(createUserDto.email);
  });
});
