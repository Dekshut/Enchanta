import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class deletePage {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  page_id: string;
}
