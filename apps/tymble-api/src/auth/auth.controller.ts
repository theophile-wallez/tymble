import { Controller, Post, Request, Response, UseGuards } from '@nestjs/common';
import type { Response as ExpressResponse } from 'express';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/localAuth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req, @Response() res: ExpressResponse) {
    const { id, token } = this.authService.login(req.user);
    
    // Set HttpOnly cookie with the JWT token
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'lax', // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return user info without the token
    return res.json({
      user: {
        id,
        email: req.user.email,
        name: req.user.name,
      },
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  logout(@Request() req, @Response() res: ExpressResponse) {
    // Clear the auth cookie
    res.clearCookie('auth_token');
    return res.json({ message: 'Logged out successfully' });
  }
}
