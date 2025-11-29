import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt.guard';
import { Public } from '@/decorators/public.decorator';
import type { GuardedRequest } from '@/types/guardedRequest.type';
import { CreateLocalUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  create(@Body() dto: CreateLocalUserDto) {
    return this.usersService.createLocalUser(dto);
  }

  @Get('profile')
  findOne(@Req() req: GuardedRequest) {
    return this.usersService.findOne(req.user.id);
  }

  @Patch()
  update(@Req() req: GuardedRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  @Delete()
  remove(@Req() req: GuardedRequest) {
    return this.usersService.remove(req.user.id);
  }
}
