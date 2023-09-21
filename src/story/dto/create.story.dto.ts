import { ApiProperty } from '@nestjs/swagger';
import {
  storyTheme,
  storyType,
  illustrationStyle,
  childAge,
  storyMainCharacter,
} from '../../entities/intefaces/story.interface';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class createStoryDto {
  @ApiProperty({
    type: String,
  })
  @IsString()
  @IsOptional()
  character_name?: string;

  @ApiProperty({
    enum: storyMainCharacter,
  })
  @IsEnum(storyMainCharacter)
  @IsOptional()
  main_character?: storyMainCharacter;

  @ApiProperty({
    enum: storyTheme,
  })
  @IsEnum(storyTheme)
  @IsOptional()
  story_theme?: storyTheme;

  @ApiProperty({
    enum: illustrationStyle,
    required: true,
  })
  @IsEnum(illustrationStyle)
  style: illustrationStyle;

  @ApiProperty({
    enum: storyType,
    required: true,
  })
  @IsEnum(storyType)
  story_type: storyType;

  @ApiProperty({
    enum: childAge,
    required: true,
  })
  @IsEnum(childAge)
  age: childAge;
}
