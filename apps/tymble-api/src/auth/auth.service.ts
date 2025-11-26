import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserSelect } from '@repo/db';
import { compare } from 'bcrypt';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

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

  login(user: UserSelect) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
