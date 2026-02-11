import { Module } from '@nestjs/common';
import { HashService } from './security/hash.service';
import { BcryptHashingService } from './security/bcrypt-hash.service';

@Module({
  providers: [
    {
      provide: HashService,
      useClass: BcryptHashingService,
    },
  ],
  exports: [HashService],
})
export class CommonModule {}
