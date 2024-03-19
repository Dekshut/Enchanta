import { BadRequestException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { PageEntity } from '../entities/page.entity';
import { deletePage } from './dto/delete-page.dto';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
// import { Configuration, OpenAIApi } from 'openai';
import * as GCloudStorage from '@google-cloud/storage';
import { UserEntity } from '../entities/user.entity';
import { ActionType, StatisticService } from '../statistic/statistic.service';
import OpenAI from 'openai';

@Injectable()
export class PageService {
  private storage = new GCloudStorage.Storage({
    projectId: 'vocal-entity-375810',
  });
  private openAi: OpenAI;
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PageEntity)
    private readonly pageRepository: Repository<PageEntity>,

    private readonly statisticService: StatisticService,
  ) {
    this.openAi = new OpenAI({
      apiKey: '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',
    });
  }

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

      const imageGenerateResult = await this.openAi.images.generate({
        prompt: `${page.image_prompt} character`,
        n: 1,
        size: '256x256',
        response_format: 'b64_json',
      });

      const image =
        `data:image/png;base64,` + imageGenerateResult.data[0].b64_json;

      const imageBuffer = this.decodeBase64Image(image);

      const imageName = `enchanta_${(Math.random() * 10000).toFixed(0)}.png`;

      await this.storage
        .bucket('enchanta-upload')
        .file(imageName)
        .save(imageBuffer['data']);

      this.pageRepository
        .save({
          ...page,
          images:
            page.images +
            `|https://storage.googleapis.com/enchanta-upload/${imageName}`,
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

      return `https://storage.googleapis.com/enchanta-upload/${imageName}`;
    } catch (error) {
      if (error) throw new BadRequestException(error.message);
    }
  }

  private decodeBase64Image(base64Str) {
    const matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const image = {};
    if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 string');
    }

    image['type'] = matches[1];
    image['data'] = Buffer.from(matches[2], 'base64');

    return image;
  }
}
