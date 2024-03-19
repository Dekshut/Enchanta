import { Injectable } from '@nestjs/common';
// import { Configuration, OpenAIApi } from 'openai';
import { createStoryDto } from '../story/dto/create.story.dto';
import {
  childAge,
  storyType,
  storyTypeCode,
} from '../entities/intefaces/story.interface';
import { STORY_PROMPTS } from './generate.constants';
import { StorySchemeType } from 'src/story/story.constants';
import { decodeBase64Image } from './helpers/decodeBase64Image';
import { setStoryPrompt } from './helpers/setStoryPrompt';
import OpenAI from 'openai';

@Injectable()
export class GenerateService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: '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',
    });
  }

  private getStoryPrompt(props: createStoryDto) {
    const { story_type, age, story_theme, main_character, character_name } =
      props;

    const storyGroup = age + storyTypeCode[story_type];
    const promptText = setStoryPrompt(STORY_PROMPTS[storyGroup], {
      main_character,
      character_name,
      story_theme,
    });

    const prompt = {
      input: promptText,
      output_schema: {
        type: 'object',
        properties: {
          pages: {
            type: 'array',
            items: {
              type: 'string',
              maxLength: 200,
            },
          },
          title: {
            type: 'string',
          },
        },
      },
    };

    return { prompt, storyGroup };
  }

  async generateStory(body: createStoryDto): Promise<{ story }> {
    let story = null;

    console.log(body);

    const { prompt, storyGroup } = this.getStoryPrompt(body);
    console.log(JSON.stringify(prompt), storyGroup);

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo-0125',
      messages: [{ role: 'user', content: JSON.stringify(prompt) }],
      response_format: { type: 'json_object' },
    });

    story = JSON.parse(completion.choices[0].message.content);

    console.log(story);

    return { story };
  }

  async generateImage(prompt) {
    let imageBuffer = null,
      imageName = null;

    try {
      const result = await this.openai.images.generate({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      });

      const image = `data:image/png;base64,` + result.data[0].b64_json;
      imageBuffer = decodeBase64Image(image);
      imageName = `enchanta_${(Math.random() * 10000).toFixed(0)}.png`;
    } catch (e) {
      throw e;
    }

    return { imageBuffer, imageName };
  }
}
