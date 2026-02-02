import { Module } from '@nestjs/common';
import { HashService } from './hash.service';

// hash.module.ts
@Module({
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
