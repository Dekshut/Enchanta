import { createPageDto } from './dto/create.page.dto';
import { PageService } from './page.service';
import { deletePage } from './dto/delete-page.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/auth.jwt.guard';

@ApiTags('Page')
@Controller('api/page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @UseGuards(JwtAuthGuard)
  @Delete('delete-page')
  @ApiBearerAuth('JWT-auth')
  async deletePage(@Body() body: deletePage, @Request() req: any) {
    return await this.pageService.deletePage(body, req.user);
  }
  @UseGuards(JwtAuthGuard)
  @Patch('update-page')
  @ApiBearerAuth('JWT-auth')
  async updatePage(@Body() body: createPageDto, @Request() req: any) {
    return await this.pageService.deletePage(body, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('generate-image')
  @ApiBearerAuth('JWT-auth')
  async regenerateImage(
    @Query() { page_id }: { page_id: string },
    @Request() req: any,
  ) {
    return await this.pageService.generateImage(page_id, req.user);
  }
}
