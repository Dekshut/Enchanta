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
  // createPagesFromText(text, storyGroup) {
  //   const pages = [];

  //   if (['2NR', '2CS', '5NR', '8P'].includes(storyGroup)) {
  //     const lineLength = text.split('\n')[0].split(' ').length;
  //     if (lineLength > 7) {
  //       for (let i = 0; i < text.split('\n').length; i += 2) {
  //         if (!text.split('\n')[i + 1]) continue;
  //         pages.push({
  //           text: text.split('\n')[i] + '<br/>' + text.split('\n')[i + 1],
  //           image_prompt: '',
  //         });
  //       }
  //     } else {
  //       for (let i = 0; i < text.split('\n').length; i += 4) {
  //         if (!text.split('\n')[i + 1] || !text.split('\n')[i + 2]) continue;
  //         pages.push({
  //           text:
  //             text.split('\n')[i] +
  //             '<br/>' +
  //             text.split('\n')[i + 1] +
  //             '<br/>' +
  //             text.split('\n')[i + 2] +
  //             '<br/>' +
  //             text.split('\n')[i + 3],
  //           image_prompt: '',
  //         });
  //       }
  //     }
  //   } else {
  //     for (let i = 0; i < text.split('\n').length; i++) {
  //       pages.push({
  //         text: text.split('\n')[i],
  //         image_prompt: '',
  //       });
  //     }
  //   }

  //   return pages;
  // }

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

    story = JSON.parse(completion.choices[0].message.content); // story: { pages, title, externalCharacterFeatures}

    console.log(story);

    return { story };
  }

  // async generatePagesPrompt(){
  //   const as = "Generate a prompt for each page so that you can then generate an image based on it. Return JSON according to the scheme below"

  //   const prompt = {
  //     input:  as,
  //     output_schema: {
  //       type: 'object',
  //       properties: {
  //         pages: {
  //           type: 'array',
  //           items: {
  //             type: 'string',
  //             length: 'up to 200 characters',
  //           },
  //         },
  //       },
  //     },
  // }

  // async generateStoryDetails(text, storyGroup) {
  //   let err = null,
  //     result = null,
  //     details = null;

  //   const prompt = ['2CS', '2NR'].includes(storyGroup)
  //     ? `Create a short title for the story. return as json "{"title": ""}". ${text}`
  //     : `Create a short title for the story. Describe the visual details of main
  //     character like size and color of body parts. Return as
  //     json "{"title": "", "characterDetails": "", "characterName": ""}". ${text}`;

  //   do {
  //     err = null;
  //     try {
  //       result = await this.openAi.createCompletion({
  //         ...this.openAiConfig,
  //         prompt: `${prompt}`,
  //       });

  //       details = result.data.choices[0].text;

  //       JSON.parse(details);
  //     } catch (e) {
  //       err = e;
  //     }
  //   } while (err);

  //   return {
  //     title: '',
  //     characterDetails: '',
  //     characterName: '',
  //     ...JSON.parse(details),
  //   };
  // }
  // async generateImagePrompt(pages, illustrationStyle, { characterDetails }) {
  //   let err = null,
  //     result = null,
  //     json = null;

  //   const prompt =
  //     `Create an ${illustrationStyle} style image prompt for the each of text. Return as json array. ` +
  //     JSON.stringify(pages);

  //   do {
  //     err = null;
  //     try {
  //       result = await this.openAi.createCompletion({
  //         ...this.openAiConfig,
  //         prompt: `${prompt}`,
  //       });

  //       json = result.data.choices[0].text;
  //       JSON.parse(json);
  //     } catch (e) {
  //       err = e;
  //     }
  //   } while (err);

  // imagePromptDetails = this.getImagePromptDetails(illustrationStyle);

  //   return JSON.parse(json).map((page) => {
  //     page.image_prompt =
  //       page.image_prompt + ` ${characterDetails}` + ` ${imagePromptDetails}`;
  //     return page;
  //   });
  // }
  async generateImage(prompt) {
    let imageBuffer = null,
      imageName = null;

    // переписать под Дали
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
