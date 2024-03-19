export const STORY_JSON_SCHEME = {
  pages: [
    {
      page_text: '',
      page_image_prompt: '',
    },
  ],
  story_title: '',
};

export type StorySchemeType = {
  pages: string[];
  externalCharacterFeatures: string;
  title: string;
};
