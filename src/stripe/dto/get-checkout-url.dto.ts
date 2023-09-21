import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumberString } from 'class-validator';

export class getCheckoutUrlDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  priceId: string;

  @ApiProperty({
    type: String,
  })
  @IsNumberString()
  quantity: number;

  @ApiProperty({
    type: String,
  })
  @IsString()
  email: string;
}
