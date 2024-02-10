import { Injectable } from '@nestjs/common';
import { Configuration, OpenAIApi } from 'openai';
import { createStoryDto } from '../story/dto/create.story.dto';
import { childAge, storyType } from '../entities/intefaces/story.interface';

@Injectable()
export class GenerateService {
  private apiKey = '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';
  private openAi: OpenAIApi;
  private openAiConfig = {
    model: 'text-davinci-003',
    temperature: 0.7,
    max_tokens: 3000,
    top_p: 1.0,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  constructor() {
    this.openAi = new OpenAIApi(
      new Configuration({
        apiKey: this.apiKey,
      }),
    );
  }
  private getImagePromptDetails(illustrationStyle) {
    if (illustrationStyle === 'Hand-drawn') {
      return 'sketch, pencil, shading, lines, textures, doodle, simple, rough. no clean lines, no digital, no computer-generated, no precise, no detailed, no polished';
    } else if (illustrationStyle === 'Pop Art') {
      return 'bold colors, vibrant, high contrast, repetition, iconic imagery, collage. no subtle, no muted colors, no soft lines, no delicate details, no watercolor, no vintage, no comic book style';
    } else if (illustrationStyle === 'Comic Book') {
      return 'panels, action, bold, dynamic, bright, primary colors. no panels, no watercolor, no soft, no pastel colors, no delicate, no fine details, no realistic, no speech bubble, no onomatopoeia';
    } else if (illustrationStyle === 'Ink') {
      return 'bold lines, high contrast, black and white, pen, ink wash, stippling, texture, vintage. no soft, no pastel colors, no gradients, no watercolor, no digital';
    } else if (illustrationStyle === 'Linocut') {
      return 'textured, block print, bold lines, high contrast, simple shapes, vintage, rustic. no delicate lines, no soft colors, no watercolor, no digital';
    } else if (illustrationStyle === 'Watercolor') {
      return 'pastel colors, wash, transparency, fluidity, softness, blend, light, dreamy. no bold lines, no harsh edges, no precise details, no solid colors, no digital';
    }
  }
  private getStoryPrompt(props: createStoryDto) {
    const { story_type, age, story_theme, main_character, character_name } =
      props;

    if (age === childAge.two_years) {
      if (story_type === storyType.COUNTING_STORY) {
        // 0-2 years, counting story 25 to 50 words | 150 to 250 characters | 7 pages min
        return {
          prompt:
            'Create a rhyming counting story appropriate for children ages 0-2. The story should ' +
            'alternatively count to 3 or 5 using words like "one, two, buckle my shoe" or "one, two, ' +
            'three, listen to me". The story should feature objects or items familiar to young children, ' +
            'such as toys, foods, or clothing items. On every line must be up to 8 words. The length of ' +
            'story should be minimum 50 words. ' +
            'The story should rhyme and use repetition to make it easy for children to follow along.',
          storyGroup: '2CS',
        };
      } else if (story_type === storyType.NURSERY_RHYME) {
        // 0-2 years, nursery rhyme 50 to 100 words | 350 to 500 characters | 7 pages min
        return {
          prompt:
            'Create a nursery rhyme appropriate for children ages 0-2 that features a simple concept ' +
            'or idea, such as a familiar object or activity. The rhyme should be easy to sing and recite ' +
            'and should count up to 3, 5, or 10. ' +
            'The length of the story should be minimum 100 words. ' +
            'On every line must be up to 6 words.',
          storyGroup: '2NR',
        };
      } else {
        // 0-2 years, bedtime story 100 to 200 words | 650 to 1000 characters | 7 pages min
        return {
          prompt:
            'Create a shooting bedtime story appropriate for children ages 0-2 that features: ' +
            `main character type is ${main_character} ` +
            (character_name
              ? `main character name is ${character_name} `
              : 'random character name') +
            `the theme of story is ${story_theme} ` +
            'The length of the story should be up to 200 words long.',
          storyGroup: '2BS',
        };
      }
    } else if (age === childAge.five_years) {
      if (story_type === storyType.NURSERY_RHYME) {
        // 3-5 years, nursery rhyme 100 to 150 words | 650 to 750 characters | 9 pages min
        return {
          prompt:
            'Create a playful nursery rhyme for kids aged 3 to 5 years old that features a simple and' +
            'relatable concept or idea, such as an animal or a favorite food. The rhyme should be' +
            'easy to sing and recite and should count up to 5 or 10. The nursery rhyme should delight young' +
            'listeners. The nursery rhyme should contain up to 150 words long or 650 to 750 characters.',
          storyGroup: '5NR',
        };
      } else if (story_type === storyType.FAIRY_TALE) {
        // 3-5 years, fairy tale 500 to 800 words | 3250 to 4000 characters | 9 pages min
        return {
          prompt:
            'Create a beautiful fairy tale story for a child aged 3 to 5 years old. The tale should feature ' +
            `main character type is ${main_character}. ` +
            (character_name
              ? `main character name is ${character_name}. `
              : 'random main character name. ') +
            `the theme of story is ${story_theme}. ` +
            'The tale should feature plenty of action and adventure to engage young readers. ' +
            'The tale should contain minimum 500 words.',
          storyGroup: '5FT',
        };
      } else {
        // 3-5 years, bedtime story 250 to 500 words | 1500 to 2500 characters | 9 pages min
        return {
          prompt:
            'Create a shooting bedtime story appropriate for children ages 3 to 5 years old that features: ' +
            `main character type is ${main_character} ` +
            (character_name
              ? `main character name is ${character_name} `
              : 'random character name') +
            `the theme of story is ${story_theme} ` +
            'The length of the story should be up to 500 words long.',
          storyGroup: '5BS',
        };
      }
    } else {
      if (story_type === storyType.POETRY) {
        // 6-8 years, poetry 100 to 200 words | 650 to 1000 characters | 7 pages min
        return {
          prompt:
            'Create a poem suitable for a child aged 6 to 8. The poem should feature ' +
            `main character type is ${main_character}. ` +
            (character_name
              ? `main character name is ${character_name}. `
              : 'random main character name. ') +
            `the theme of poetry is ${story_theme}. ` +
            'The poem’s length should be between 100 and 200 words.',
          storyGroup: '8P',
        };
      } else if (story_type === storyType.FAIRY_TALE) {
        // 6-8 years, fairy tale 800 to 1500 words | 4000 to 7500 characters | 11 pages min
        return {
          prompt:
            'Create a beautiful fairy tale for a child aged 6 to 8 years old. The tale should feature ' +
            `main character type is ${main_character}. ` +
            (character_name
              ? `main character name is ${character_name}. `
              : 'random main character name. ') +
            `the theme of story is ${story_theme}. ` +
            'The tale should feature plenty of action and adventure to engage young readers. ' +
            'The length of the fairy tale should be between 800 and 1500 words.',
          storyGroup: '8FT',
        };
      } else {
        // 6-8 years, bedtime story 500 to 800 words | 3250 to 4000 characters | 11 pages min
        return {
          prompt:
            'Create a shooting bedtime story appropriate for children ages 6 to 8 years old that features: ' +
            `main character type is ${main_character} ` +
            (character_name
              ? `main character name is ${character_name} `
              : 'random character name') +
            `the theme of story is ${story_theme} ` +
            'The length of the story should be up to 800 words long.',
          storyGroup: '8BS',
        };
      }
    }
  }
  createPagesFromText(text, storyGroup) {
    const pages = [];

    if (['2NR', '2CS', '5NR', '8P'].includes(storyGroup)) {
      const lineLength = text.split('\n')[0].split(' ').length;
      if (lineLength > 7) {
        for (let i = 0; i < text.split('\n').length; i += 2) {
          if (!text.split('\n')[i + 1]) continue;
          pages.push({
            text: text.split('\n')[i] + '<br/>' + text.split('\n')[i + 1],
            image_prompt: '',
          });
        }
      } else {
        for (let i = 0; i < text.split('\n').length; i += 4) {
          if (!text.split('\n')[i + 1] || !text.split('\n')[i + 2]) continue;
          pages.push({
            text:
              text.split('\n')[i] +
              '<br/>' +
              text.split('\n')[i + 1] +
              '<br/>' +
              text.split('\n')[i + 2] +
              '<br/>' +
              text.split('\n')[i + 3],
            image_prompt: '',
          });
        }
      }
    } else {
      for (let i = 0; i < text.split('\n').length; i++) {
        pages.push({
          text: text.split('\n')[i],
          image_prompt: '',
        });
      }
    }

    return pages;
  }

  async generateStory(body) {
    let err = null,
      result = null,
      story = null;

    const { prompt, storyGroup } = this.getStoryPrompt(body);

    console.log(prompt);

    do {
      err = null;
      try {
        result = await this.openAi.createCompletion({
          ...this.openAiConfig,
          prompt: `${prompt}`,
        });

        story = result.data.choices[0].text;

        story = story
          .replace('The end.', '')
          .replace('The End.', '')
          .replace('THE END.', '')
          .replace('THE END', '')
          .replace('The end', '')
          .replace('The End', '')
          .replace('THE END!', '')
          .replace('The End!', '')
          .replace('The end!', '');

        const line = story.split('\n').filter(Boolean)[0].split(' ');
        const pages = (() => {
          if (['2CS', '2NR', '5NR', '8P'].includes(storyGroup)) {
            if (line.length > 7)
              return story.split('\n').filter(Boolean).length / 2;
            else return story.split('\n').filter(Boolean).length / 4;
          } else return null;
        })();

        const storyLength = story
          .split('\n')
          .filter(Boolean)
          .join(' ')
          .split(' ').length;

        if (
          ['2CS', '2NR', '5NR', '8P'].includes(storyGroup) &&
          pages.toString().includes('.')
        ) {
          err = true;
        }

        console.log('storyGroup: ', storyGroup);
        console.log('pages: ', pages);
        console.log(
          'word length: ',
          story.split('\n').filter(Boolean).join(' ').split(' ').length,
        );

        if (storyGroup === '2CS') {
          if (line.length > 8) err = true;
          if (pages < 4 || pages > 7) err = true;
        } else if (storyGroup === '2NR') {
          if (line.length > 8) err = true;
          if (pages < 5 || pages > 10) err = true;
        } else if (storyGroup === '2BS') {
          if (storyLength < 100 || storyLength > 200) err = true;
        } else if (storyGroup === '5NR') {
          if (line.length > 8) err = true;
          if (pages < 5 || pages > 13) err = true;
          if (storyLength < 100 || storyLength > 150) err = true;
        } else if (storyGroup === '5BS') {
          if (storyLength < 250 || storyLength > 500) err = true;
        } else if (storyGroup === '5FT') {
          if (storyLength < 350 || storyLength > 800) err = true;
        } else if (storyGroup === '8BS') {
          if (storyLength < 350 || storyLength > 800) err = true;
        } else if (storyGroup === '8FT') {
          if (storyLength < 400 || storyLength > 1500) err = true;
        } else {
          // storyGroup === '8P'
          if (storyLength < 100 && storyLength > 200) err = true;
          if (line.length > 8) err = true;
        }
      } catch (e) {
        err = e;
      }
    } while (err);

    story = story.split('\n').filter(Boolean).join('\n');

    return {
      story,
      storyGroup,
    };
  }
  async generateStoryDetails(text, storyGroup) {
    let err = null,
      result = null,
      details = null;

    const prompt = ['2CS', '2NR'].includes(storyGroup)
      ? `Create a short title for the story. return as json "{"title": ""}". ${text}`
      : `Create a short title for the story. Describe the visual details of main 
      character like size and color of body parts. Return as
      json "{"title": "", "characterDetails": "", "characterName": ""}". ${text}`;

    do {
      err = null;
      try {
        result = await this.openAi.createCompletion({
          ...this.openAiConfig,
          prompt: `${prompt}`,
        });

        details = result.data.choices[0].text;

        JSON.parse(details);
      } catch (e) {
        err = e;
      }
    } while (err);

    return {
      title: '',
      characterDetails: '',
      characterName: '',
      ...JSON.parse(details),
    };
  }
  async generateImagePrompt(pages, illustrationStyle, { characterDetails }) {
    let err = null,
      result = null,
      json = null;

    const prompt =
      `Create an ${illustrationStyle} style image prompt for the each of text. Return as json array. ` +
      JSON.stringify(pages);

    do {
      err = null;
      try {
        result = await this.openAi.createCompletion({
          ...this.openAiConfig,
          prompt: `${prompt}`,
        });

        json = result.data.choices[0].text;
        JSON.parse(json);
      } catch (e) {
        err = e;
      }
    } while (err);

    const imagePromptDetails = this.getImagePromptDetails(illustrationStyle);

    return JSON.parse(json).map((page) => {
      page.image_prompt =
        page.image_prompt + ` ${characterDetails}` + ` ${imagePromptDetails}`;
      return page;
    });
  }
  async generateImage(prompt) {
    let err = null,
      imageBuffer = null,
      imageName = null;

    do {
      try {
        const result = await this.openAi.createImage({
          prompt,
          n: 1,
          size: '256x256',
          response_format: 'b64_json',
        });

        const image = `data:image/png;base64,` + result.data.data[0].b64_json;

        imageBuffer = this.decodeBase64Image(image);

        imageName = `enchanta_${(Math.random() * 10000).toFixed(0)}.png`;
      } catch (e) {
        err = e;
      }
    } while (err);

    return { imageBuffer, imageName };
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
