import { PromptEntity } from '../entities/prompt.entity';
import { PageEntity } from '../entities/page.entity';
import { StoryEntity } from '../entities/story.entity';
import { BadRequestException } from '@nestjs/common/exceptions';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createStoryDto } from './dto/create.story.dto';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ShareLinkEntity } from '../entities/shareLink.entity';
import { FeedbackEntity } from '../entities/feedback.entity';
import * as GCloudStorage from '@google-cloud/storage';
import { ActionType, StatisticService } from 'src/statistic/statistic.service';
import { GenerateService } from '../generate/generate.service';
import { title } from 'node:process';
import { v2 as cloudinaryV2, UploadApiResponse } from 'cloudinary';
import { ILLUSTRATION_STYLES } from 'src/generate/generate.constants';
const fs = require('fs');

@Injectable()
export class StoryService {
  private storage = new GCloudStorage.Storage({
    projectId: 'vocal-entity-375810',
  });

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ShareLinkEntity)
    private readonly shareLinkRepository: Repository<ShareLinkEntity>,
    @InjectRepository(StoryEntity)
    private readonly storyRepository: Repository<StoryEntity>,
    @InjectRepository(PageEntity)
    private readonly pageRepository: Repository<PageEntity>,
    @InjectRepository(PromptEntity)
    private readonly promptRepository: Repository<PromptEntity>,
    @InjectRepository(FeedbackEntity)
    private readonly feedbackRepository: Repository<FeedbackEntity>,

    private readonly statisticService: StatisticService,
    private readonly generateService: GenerateService,
  ) {}

  private async uploadToCloudinary(
    imageBuffer: Buffer,
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinaryV2.uploader
        .upload_stream(
          {
            folder: 'Home',
          },
          (error, result: UploadApiResponse) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          },
        )
        .end(imageBuffer);
    });
  }
  async generateStory(body: createStoryDto, email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    if (user.quantity <= 0)
      throw new BadRequestException('Do not have enough credits');

    const story = await this.storyRepository.save({
      ...body,
      title: '',
      user,
      status: 'loading',
    });

    await this.userRepository.update(
      { id: user.id },
      { quantity: user.quantity - 1 },
    );

    this.createStory(body, email, story).then();

    return {
      ...story,
      status: 'loading',
    };
  }

  async getStoryStatus(story_id: string) {
    const story = await this.storyRepository.findOne({
      where: { id: +story_id },
    });
    return story ? story.status : 'loading';
  }

  async createStory(body: createStoryDto, email: string, storyEntity) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new BadRequestException('User not found');

    const { story } = await this.generateService.generateStory(body);

    if (!story) throw new Error('Unexpected story type');

    // const { title, characterDetails } =
    //   await this.generateService.generateStoryDetails(story, storyGroup);

    // const pages = this.generateService.createPagesFromText(story, storyGroup);

    // const pagesWithPrompt = await this.generateService.generateImagePrompt(
    //   pages,
    //   body.style,
    //   characterDetails,
    // );

    // const { imageBuffer, imageName } = await this.generateService.generateImage(
    //   'Illustrate this scene with pastel colors, wash, transparency, fluidity, softness, blend, light, and dreamy style. Picture Denys exploring a magical world with a wide-eyed wonder, surrounded by a gentle ambiance. Avoid bold lines, harsh edges, precise details, and solid colors in the image.' +
    //     'sketch, pencil, shading, lines, textures, doodle, simple, rough. no clean lines, no digital, no computer-generated, no precise, no detailed, no polished',
    // );

    // console.log(imageBuffer);

    // const filePath = `src/${imageName}`;
    // fs.writeFileSync(filePath, imageBuffer.data);

    // const imageData = fs.readFileSync('src/enchanta_1316.png');

    // console.log(imageData);

    // const imageName = `enchanta_${(Math.random() * 10000).toFixed(0)}.png`;

    // console.log('https://storage.googleapis.com/novelin-upload/' + imageName);

    // const imageBuffer = decodeBase64Image(image);

    // const cloudinaryResult = await this.uploadToCloudinary(imageData);

    // console.log(cloudinaryResult?.url);

    const generatedStory = {
      title: story.title,
      pages: [],
    };

    await Promise.all(
      story.pages.map(async (page) => {
        const pageText = Array.isArray(page) ? page.join(' ') : page;

        const imagePrompt =
          `Create an illustration based on the scene described in the book page: 
        ${pageText}` +
          `Your style requirements: ${ILLUSTRATION_STYLES[body.style]}`;

        const { imageBuffer } = await this.generateService.generateImage(
          imagePrompt,
        );

        const cloudinaryResult = await this.uploadToCloudinary(
          imageBuffer.data,
        );

        generatedStory.pages.push({
          page_text: pageText,
          page_image_prompt: imagePrompt,
          img_url: cloudinaryResult.url,
        });
      }),
    );

    this.statisticService.newStory(!user.newStoryCreated, user.id).catch();

    if (!user.newStoryCreated) {
      user.newStoryCreated = true;
      this.userRepository.save(user).catch();
    }

    let i = 0;

    console.log(generatedStory);

    for (const {
      page_text,
      page_image_prompt,
      img_url,
    } of generatedStory.pages) {
      if (page_text.length > 145) {
        const middleSpaceIndex = page_text
          .substring(0, page_text.length / 2)
          .lastIndexOf(' ');

        const part1 = page_text.substring(0, middleSpaceIndex);
        const part2 = page_text.substring(
          middleSpaceIndex + 1,
          page_text.length,
        );

        await this.pageRepository.save({
          story: storyEntity,
          text: part1,
          image_prompt: page_image_prompt,
          image: img_url,
          position: i++,
          images: img_url,
        });

        await this.pageRepository.save({
          story: storyEntity,
          text: part2,
          image_prompt: page_image_prompt,
          image: img_url,
          position: i++,
          images: img_url,
        });
      } else {
        await this.pageRepository.save({
          story: storyEntity,
          text: page_text,
          image_prompt: page_image_prompt,
          image: img_url,
          position: i++,
          images: img_url,
        });
      }
    }

    return await this.storyRepository.save({
      ...storyEntity,
      title: generatedStory.title,
      cover: generatedStory.pages[0].img_url,
      status: 'ok',
    });
  }

  async getStoryById(storyId) {
    const story = await this.storyRepository.findOne({
      where: { id: storyId },
      relations: {
        page: true,
      },
      select: {
        page: {
          id: true,
          image: true,
          text: true,
          position: true,
        },
      },
      order: {
        page: {
          position: 'ASC',
        },
      },
    });

    if (!story) throw new BadRequestException('Story not found');

    return {
      id: story.id,
      title: story.title.replaceAll('{{name}}', story.character_name), // temporary fix
      cover: story.page[0].image,
      hasAudio: story.hasAudio,
      audioUrl: story.audioUrl,
      audioCover: story.audioCover,
      story: story.page
        .sort((a, b) => a.position - b.position)
        .map((page) => ({
          id: page.id,
          text: page.text.replaceAll('{{name}}', story.character_name), // temporary fix
          image: page.image,
        })),
    };
  }

  async getStory(email) {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    if (!user) throw new BadRequestException('User not found');

    const stories = await this.storyRepository.find({
      where: { userId: user.id },
      relations: {
        user: true,
        page: true,
      },
      select: {
        page: {
          id: true,
          image: true,
          text: true,
          position: true,
        },
      },
      order: {
        created_at: 'ASC',
      },
    });

    return stories
      .map((story) => ({
        id: story.id,
        title: story.title.replaceAll('{{name}}', story.character_name),
        cover: story.page[0]?.image || '',
        hasAudio: story.hasAudio,
        audioUrl: story.audioUrl,
        audioCover: story.audioCover,
        story: story.page
          .sort((a, b) => a.position - b.position)
          .map((page) => ({
            id: page.id,
            text: page.text.replaceAll('{{name}}', story.character_name),
            image: page.image || '',
          })),
      }))
      .reverse();
  }

  async deleteStory(storyId, email) {
    await this.storyRepository.delete(storyId);

    const user = await this.userRepository.findOne({ where: { email } });

    this.statisticService
      .logAction(ActionType.DELETE_STORY, user.id)
      .catch(console.log);

    return 'ok';
  }

  async updateStory(body, email) {
    const story = await this.storyRepository.findOne({
      where: {
        id: body.id,
      },
    });

    if (!story) throw new BadRequestException('Story not found');

    await this.storyRepository.update(story.id, {
      title: body.title,
      audioCover: body.audioCover || story.audioCover,
    });

    for (const page of body.story) {
      this.pageRepository
        .update(page.id, {
          text: page.text,
          image: page.image,
        })
        .then()
        .catch();
    }

    const user = await this.userRepository.findOne({ where: { email } });

    this.statisticService
      .logAction(ActionType.UPDATE_STORY, user.id)
      .catch(console.log);

    return 'ok';
  }

  async playAmbientMusic(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return 'ok';

    this.statisticService
      .playMusic(!user.musicWasPlayed, user.id)
      .catch(console.log);

    if (!user.musicWasPlayed) {
      user.musicWasPlayed = true;
      await this.userRepository.save(user);
    }

    return 'ok';
  }

  async getShareLink({ story_id, host }: { story_id: string; host: string }) {
    let shareLinkEntity = await this.shareLinkRepository.findOne({
      where: { toStory: { id: +story_id } },
    });

    if (shareLinkEntity) return `${host}/story/${shareLinkEntity.link}`;
    else {
      const story = await this.storyRepository.findOne({
        where: { id: +story_id },
      });
      if (!story) throw new BadRequestException('Story not found');

      const arrayLink = story.title
        .split(' ')
        .map((w) => w[0])
        .concat(Math.floor(Math.random() * 1000) + '');

      // Shuffle shareLink array
      for (let i = arrayLink.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arrayLink[i], arrayLink[j]] = [arrayLink[j], arrayLink[i]];
      }

      const shareLink = arrayLink.join('');

      shareLinkEntity = this.shareLinkRepository.create({
        link: shareLink,
        toStory: story,
      });

      this.shareLinkRepository.save(shareLinkEntity).catch(console.log);

      return `${host}/story/${shareLink}`;
    }
  }

  async shareStory(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return 'ok';

    this.statisticService
      .newSharing(!user.storyWasShared, user.id)
      .catch(console.log);

    if (!user.storyWasShared) {
      user.storyWasShared = true;
      await this.userRepository.save(user);
    }

    return 'ok';
  }

  async getSharedStory(link: string) {
    const sharedLink = await this.shareLinkRepository.findOne({
      where: { link },
      relations: {
        toStory: {
          page: true,
        },
      },
      select: {
        id: true,
        toStory: {
          id: true,
          title: true,
          hasAudio: true,
          audioUrl: true,
          audioCover: true,
          page: {
            id: true,
            image: true,
            text: true,
            position: true,
          },
        },
      },
      order: {
        toStory: {
          page: {
            position: 'ASC',
          },
        },
      },
    });

    return {
      ...sharedLink.toStory,
      cover: sharedLink.toStory.page[0].image,
    };
  }

  async getStoryMeta(link: string) {
    const story = await this.getSharedStory(link);
    if (!story) throw new BadRequestException('Story not found');

    return {
      title: story.title,
      image: story.cover,
    };
  }

  async feedback({ story_id, rate, feedback }, email) {
    await this.feedbackRepository.save({
      toStoryId: story_id,
      rate,
      feedback,
      email,
    });

    if (email === 'Unregistered') return 'ok';
    else {
      this.userRepository
        .findOne({ where: { email: email || 'Unregistered' } })
        .then((user) => {
          if (!user) return;

          this.statisticService
            .newFeedback(!user.feedbackWasLeft, user.id)
            .catch(console.log);

          if (!user.feedbackWasLeft) {
            this.userRepository
              .update(user, {
                feedbackWasLeft: true,
              })
              .catch(console.log);
          }
        });
    }

    return 'ok';
  }

  async getFeedbacks(page) {
    const feedbacks = await this.feedbackRepository.find({
      order: {
        created_at: 'DESC',
      },
      take: 20,
      skip: 20 * (page - 1),
    });

    return feedbacks.map((feedback) => ({
      feedback: feedback.feedback,
      story_id: feedback.toStoryId,
      rate: feedback.rate,
      created_at: feedback.created_at.toLocaleDateString(),
    }));
  }

  async saveAudio(file, storyId) {
    const story = await this.storyRepository.findOne({
      where: { id: storyId },
      relations: { user: true },
    });

    if (!story) throw new BadRequestException('Story not found');

    const oldAudioName = story.audioUrl.split('/').pop();
    oldAudioName &&
      this.storage
        .bucket('enchanta-upload')
        .file(oldAudioName)
        .delete()
        .catch(console.log);

    this.statisticService
      .newAudio(!story.user.audioWasCreated, !!oldAudioName, story.user.id)
      .catch();

    if (!story.user.audioWasCreated) {
      story.user.audioWasCreated = true;
      this.userRepository.save(story.user).catch(console.log);
    }

    const audioName = `audio_${storyId}_${Date.now()}.mp3`;

    await this.storage
      .bucket('enchanta-upload')
      .file(audioName)
      .save(file['buffer']);

    await this.storyRepository.update(storyId, {
      audioUrl: `https://storage.googleapis.com/enchanta-upload/${audioName}`,
      hasAudio: true,
    });

    return `https://storage.googleapis.com/enchanta-upload/${audioName}`;
  }
}
