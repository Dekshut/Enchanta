import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { getStoryById } from './dto/get.story.dto';
import { createStoryDto } from './dto/create.story.dto';
import { JwtAuthGuard } from '../auth/guards/auth.jwt.guard';
import { StoryService } from './story.service';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Query,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FeedbackDto } from './dto/feedback.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Story')
@Controller('api/story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('create')
  async createStory(@Body() body: createStoryDto, @Request() req: any) {
    return await this.storyService.generateStory(body, req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Get('status')
  @ApiBearerAuth('JWT-auth')
  async getStoryStatus(@Query() { story_id }: { story_id: string }) {
    return await this.storyService.getStoryStatus(story_id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-story-by-id')
  async getStoryById(@Query() query: getStoryById) {
    return await this.storyService.getStoryById(query.story_id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('get-user-story')
  async getUserStories(@Request() req: any) {
    return await this.storyService.getStory(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-story')
  @ApiBearerAuth('JWT-auth')
  async deleteStory(@Query() query: { story_id: string }, @Request() req: any) {
    return await this.storyService.deleteStory(query.story_id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-story')
  @ApiBearerAuth('JWT-auth')
  async updateStory(@Body() body: any, @Request() req: any) {
    return await this.storyService.updateStory(body, req.user);
  }

  @Get('share-link')
  async getShareLink(
    @Query() { story_id }: { story_id: string },
    @Request() req: Request,
  ) {
    const host = req.headers['host'];
    return await this.storyService.getShareLink({ story_id, host });
  }

  @Get('shared-story')
  async getSharedStory(@Query() { link }: { link: string }) {
    return await this.storyService.getSharedStory(link.split('?')[0]);
  }

  @Get('share-story')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async shareStory(@Req() req: any) {
    return await this.storyService.shareStory(req.user);
  }

  @Get('play-ambient')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async playAmbientMusic(@Req() req: any) {
    return await this.storyService.playAmbientMusic(req.user);
  }

  @Post('feedback')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  async feedback(@Body() body: FeedbackDto, @Req() req: any) {
    return await this.storyService.feedback(body, req.user);
  }

  @Get('feedbacks')
  @UseGuards(JwtAuthGuard)
  async getFeedbacks(@Query() { page }) {
    return await this.storyService.getFeedbacks(page);
  }

  @Post('audio')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @UseInterceptors(FileInterceptor('file'))
  async saveAudio(@UploadedFile() file, @Body() { storyId: story_id }) {
    return this.storyService.saveAudio(file, story_id);
  }
}
