import { StoryProps } from '../generate.types';

const PROMPT_ENDING =
  'There should be a maximum of 5 pages in total, with up to 200 characters on each page. Additionally, format the output as a JSON with separate pages, each containing a set of only text lines. No need to index page number, just generate its text!';

export const setStoryPrompt = (
  template: string,
  { main_character, character_name, story_theme }: StoryProps,
): string => {
  const mainCharacterText = character_name
    ? `The main character's name is ${character_name}`
    : 'A random main character name is chosen';

  const storyText = template
    .replace('{main_character}', main_character)
    .replace('{main_character_text}', mainCharacterText)
    .replace('{story_theme}', story_theme);

  return storyText + PROMPT_ENDING;
};
