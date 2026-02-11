import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create.user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request';
import { UpdatePasswordDto } from './dto/update-password.user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

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

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  updatePassword(
    @Req() req: AuthenticatedRequest,
    @Body() passwordDto: UpdatePasswordDto,
  ) {
    this.userService.updatePassword(req.user.id, passwordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  remove(@Req() req: AuthenticatedRequest) {
    return this.userService.remove(req.user.id);
  }

  @Get()
  findByEmail(@Query('email') email: string) {
    return this.userService.findByEmail(email);
  }
}
