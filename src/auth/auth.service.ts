import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { HashService } from 'src/common/security/hash.service';
import { plainToInstance } from 'class-transformer';
import { ResponseUserDto } from 'src/user/dto/response-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userService.findByEmailWithPassword(dto.email);
    const error = new UnauthorizedException('Credenciais inválidas');

    if (!user) {
      throw error;
    }

    const isPasswordValid = await this.hashingService.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw error;
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    user.forceLogout = false;

    await this.userService.save(user);

    return {
      accessToken,
      user: plainToInstance(ResponseUserDto, user, {
        excludeExtraneousValues: true,
      }),
    };
  }
}
