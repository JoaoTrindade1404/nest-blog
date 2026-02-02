import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { HashModule } from 'src/common/security/hash.module';

@Module({
  imports: [HashModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
