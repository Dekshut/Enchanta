import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class getStoryById {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  story_id: string;
}
