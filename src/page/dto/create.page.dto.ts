import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createPageDto {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  page_id: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  text: string;

  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  image: string;
}
