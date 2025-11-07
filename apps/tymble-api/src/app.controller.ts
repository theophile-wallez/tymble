import { Controller, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import { SupabaseService } from './supabase/supabase.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  async me(@Headers('authorization') authHeader?: string) {
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length)
      : undefined;
    if (!token) {
      throw new UnauthorizedException('Missing bearer token');
    }

    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data?.user) {
      throw new UnauthorizedException('Invalid token');
    }
    return { authenticated_user: data.user };
  }
}
