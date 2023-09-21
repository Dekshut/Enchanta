import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class getSessionInfoDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  session_id: string;
}
