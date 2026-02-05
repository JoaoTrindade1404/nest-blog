import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @HttpCode(201)
  create(@Body() user: CreateUserDto) {
    return this.userService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(@Req() req: AuthenticatedRequest, @Body() userDto: UpdateUserDto) {
    return this.userService.update(req.user.id, userDto);
  }
}
