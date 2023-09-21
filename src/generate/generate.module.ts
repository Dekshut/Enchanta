import { Module } from '@nestjs/common';
import { GenerateService } from './generate.service';

@Module({
  providers: [GenerateService],
  exports: [GenerateService],
})
export class GenerateModule {}
