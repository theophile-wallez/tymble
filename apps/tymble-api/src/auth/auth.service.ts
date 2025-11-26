import { Injectable, Logger } from '@nestjs/common';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly usersService: UsersService) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    const localAuth = user.auths.find((auth) => auth.provider === 'local');
    if (!localAuth) {
      this.logger.error(`No local auth found for user with email: ${email}`);
      return null;
    }

    if (localAuth.passwordHash === null) {
      this.logger.error(`User with email: ${email} has no password set.`);
      return null;
    }

    const isMatch = await compare(password, localAuth.passwordHash);

    if (isMatch) {
      const { auths: _, ...result } = user;
      return result;
    }

    return null;
  }
}
