import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { HashModule } from 'src/common/security/hash.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Registra o UserRepository
    HashModule,
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
