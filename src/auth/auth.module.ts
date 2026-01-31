import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [],
  exports: [],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
