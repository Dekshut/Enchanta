import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FeedbackDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  story_id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  feedback: string;
}
