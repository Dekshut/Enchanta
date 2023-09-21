import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class regeneratePageImageDto {
  @ApiProperty({
    required: true,
  })
  @IsString()
  page_id: string;
}
