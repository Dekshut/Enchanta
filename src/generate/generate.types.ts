export type StoryProps = {
  main_character: string;
  character_name: string;
  story_theme: string;
};

export type StoryCreator = (props: StoryProps) => string;
