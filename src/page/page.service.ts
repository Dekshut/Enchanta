import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { PageEntity } from '../entities/page.entity';
import { deletePage } from './dto/delete-page.dto';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { ActionType, StatisticService } from '../statistic/statistic.service';
import { StoryService } from 'src/story/story.service';
import { GenerateService } from 'src/generate/generate.service';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PageEntity)
    private readonly pageRepository: Repository<PageEntity>,

    private readonly statisticService: StatisticService,
    private readonly generateService: GenerateService,
    private readonly storyService: StoryService,
  ) {}

  async deletePage(body: deletePage, email) {
    const page = await this.pageRepository.findOne({
      where: { id: +body.page_id },
    });
    if (!page) throw new BadRequestException('Page not found');

    const user = await this.userRepository.findOne({ where: { email } });

    this.statisticService
      .logAction(ActionType.DELETE_PAGE, user.id)
      .catch(console.log);

    return await this.pageRepository.remove(page);
  }

  async generateImage(page_id, email) {
    try {
      const page = await this.pageRepository.findOneOrFail({
        where: { id: +page_id },
      });
      const existImages = page.images.split('|').filter(Boolean);
      if (existImages.length >= 5) {
        return existImages[Math.floor(Math.random() * existImages.length)];
      }

      const { imageBuffer } = await this.generateService.generateImage(
        page.image_prompt,
      );

      const cloudinaryResult = await this.storyService.uploadToCloudinary(
        imageBuffer.data,
      );

      this.pageRepository
        .save({
          ...page,
          images: page.images + '|' + cloudinaryResult.url,
        })
        .then(async (page) => {
          const samePages = await this.pageRepository.find({
            where: {
              image_prompt: page.image_prompt,
            },
          });
          for (const page of samePages) {
            this.pageRepository
              .save({
                ...page,
                images: page.images,
              })
              .catch();
          }
        })
        .catch();

      const user = await this.userRepository.findOne({ where: { email } });

      this.statisticService
        .newImage(!user.imageWasChanged, user.id)
        .catch(console.log);

      if (!user.imageWasChanged) {
        user.imageWasChanged = true;
        await this.userRepository.save(user);
      }

      return cloudinaryResult.url;
    } catch (error) {
      if (error) throw new BadRequestException(error.message);
    }
  }
}
