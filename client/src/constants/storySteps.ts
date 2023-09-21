/* eslint-disable quotes */
interface IStorySteps {
  '0': {
    title: string;
    variants: CardAgeInfo[];
  };
  '1': {
    title: string;
    variants: CardStoryTypeInfo[];
  };
  '2': {
    title: string;
    variants: CardInfo[];
  };
  '2.1': {
    title: string;
    variants: CardCharacterDetailsInfo[];
  };
  '2.2': {
    title: string;
    variants: CardCharacterDetailsInfo[];
  };
  '3': {
    title: string;
    variants: CardInfo[];
  };
  '4': {
    title: string;
    variants: CardInfo[];
  };
  '5': {
    title: string;
    desc: string;
    variants: CardInfo[];
  };
  '6': {
    title: string;
    desc: string;
    variants: CardInfo[];
  };
  '7': {
    title: string;
    desc: string;
    variants: CardInfo[];
  };
}

export const storySteps: IStorySteps = {
  '0': {
    title: 'How old is the child you are creating a story for?',
    variants: [
      {
        step: '0',
        nextstep: '1',
        key: 'baby',
        alt: 'baby',
        desc: '0 to 2 years old',
        type: 'Age group',
        value: '2',
        indexImg: 0,
      },
      {
        step: '0',
        nextstep: '1',
        key: 'preschool',
        alt: 'preschool',
        desc: '3 to 5 years old',
        type: 'Age group',
        value: '5',
        indexImg: 1,
      },
      {
        step: '0',
        nextstep: '1',
        key: 'school',
        alt: 'school',
        desc: '6 to 8 years old',
        type: 'Age group',
        value: '8',
        indexImg: 2,
      },
    ],
  },
  '1': {
    title: 'Which type of story do you want to create?',
    variants: [
      {
        step: '1',
        nextstep: '4',
        location: ['baby'],
        alt: 'counting',
        desc: 'Counting Story',
        type: 'Story type',
        value: 'Counting',
        indexImg: 0,
      },
      {
        step: '1',
        nextstep: '4',
        location: ['baby', 'preschool'],
        alt: 'nursery_rhyme',
        desc: 'Nursery Rhyme',
        type: 'Story type',
        value: 'Nursery Rhyme',
        indexImg: 1,
      },
      {
        step: '1',
        nextstep: '2',
        location: ['baby', 'preschool', 'school'],
        alt: 'bedtime_story',
        desc: 'Bedtime Story',
        type: 'Story type',
        value: 'Bedtime Story',
        indexImg: 2,
      },
      {
        step: '1',
        nextstep: '2',
        location: ['preschool', 'school'],
        alt: 'fairy_tale',
        desc: 'Fairy Tale',
        type: 'Story type',
        value: 'Fairy tale',
        indexImg: 3,
      },
      {
        step: '1',
        nextstep: '2',
        location: ['school'],
        alt: 'poetry',
        desc: 'Poetry',
        type: 'Story type',
        value: 'Poetry',
        indexImg: 4,
      },
    ],
  },
  '2': {
    title: 'Who is the main character of your story?',
    variants: [
      {
        step: '2',
        nextstep: '2.1',
        alt: 'boy',
        desc: 'Boy',
        type: 'Main character',
        value: 'Boy',
        indexImg: 0,
      },
      {
        step: '2',
        nextstep: '2.1',
        alt: 'girl',
        desc: 'Girl',
        type: 'Main character',
        value: 'Girl',
        indexImg: 1,
      },
      {
        step: '2',
        nextstep: '2.1',
        alt: 'man',
        desc: 'Man',
        type: 'Main character',
        value: 'Man',
        indexImg: 2,
      },
      {
        step: '2',
        nextstep: '2.1',
        alt: 'woman',
        desc: 'Woman',
        type: 'Main character',
        value: 'Woman',
        indexImg: 3,
      },
      {
        step: '2',
        nextstep: '2.2',
        alt: 'animal',
        desc: 'Animal',
        type: 'Main character',
        value: 'Animal',
        indexImg: 4,
      },
      {
        step: '2',
        nextstep: '2.2',
        alt: 'fantastical_creature',
        desc: 'Fantastical Creature',
        type: 'Main character',
        value: 'Fantastical Creature',
        indexImg: 5,
      },
    ],
  },
  '2.1': {
    title: 'What is the name of the main character in your story?',
    variants: [
      {
        step: '2.1',
        nextstep: '3',
        alt: '',
        desc: 'Enter a custom name',
        label: 'Custom Name',
        type: 'Custom name',
        value: '',
        indexImg: 0,
      },
      {
        step: '2.1',
        nextstep: '3',
        alt: '',
        desc: 'Let Enchanta choose a random name',
        label: '',
        type: 'Random name',
        value: '',
        indexImg: 1,
      },
    ],
  },
  '2.2': {
    title: 'What details about the main character do you want to include?',
    variants: [
      {
        step: '2.2',
        nextstep: '3',
        alt: '',
        desc: 'Enter custom details (type, name, etc.)',
        label: 'Custom Details',
        type: 'Custom details',
        value: '',
        indexImg: 0,
      },
      {
        step: '2.2',
        nextstep: '3',
        alt: '',
        desc: 'Let Enchanta choose random character details',
        label: '',
        type: 'Random details',
        value: '',
        indexImg: 1,
      },
    ],
  },
  '3': {
    title: 'What theme do you want to explore in your story?',
    variants: [
      {
        step: '3',
        nextstep: '4',
        alt: 'friendship',
        desc: 'Friendship',
        type: 'Theme',
        value: 'Friendship',
        indexImg: 0,
      },
      {
        step: '3',
        nextstep: '4',
        alt: 'family',
        desc: 'Family',
        type: 'Theme',
        value: 'Family',
        indexImg: 1,
      },
      {
        step: '3',
        nextstep: '4',
        alt: 'emotions',
        desc: 'Emotions',
        type: 'Theme',
        value: 'Emotions',
        indexImg: 2,
      },
      {
        step: '3',
        nextstep: '4',
        alt: 'courage',
        desc: 'Courage',
        type: 'Theme',
        value: 'Courage',
        indexImg: 3,
      },
      {
        step: '3',
        nextstep: '4',
        alt: 'responsibility',
        desc: 'Responsibility',
        type: 'Theme',
        value: 'Responsibility',
        indexImg: 4,
      },
      {
        step: '3',
        nextstep: '4',
        alt: 'perseverance',
        desc: 'Perseverance',
        type: 'Theme',
        value: 'Perseverance',
        indexImg: 5,
      },
    ],
  },
  '4': {
    title: 'What style of illustrations do you want to use in your story?',
    variants: [
      {
        step: '4',
        nextstep: '5',
        alt: 'hand-drawn',
        desc: 'Hand-drawn',
        type: 'Illustration style',
        value: 'Hand-drawn',
        indexImg: 0,
      },
      {
        step: '4',
        nextstep: '5',
        alt: 'comic_book',
        desc: 'Comic Book',
        type: 'Illustration style',
        value: 'Comic Book',
        indexImg: 1,
      },
      {
        step: '4',
        nextstep: '5',
        alt: 'watercolor',
        desc: 'Watercolor',
        type: 'Illustration style',
        value: 'Watercolor',
        indexImg: 2,
      },
      {
        step: '4',
        nextstep: '5',
        alt: 'ink',
        desc: 'Ink',
        type: 'Illustration style',
        value: 'Ink',
        indexImg: 3,
      },
      {
        step: '4',
        nextstep: '5',
        alt: 'linocut',
        desc: 'Linocut',
        type: 'Illustration style',
        value: 'Linocut',
        indexImg: 4,
      },
      {
        step: '4',
        nextstep: '5',
        alt: 'pop_art',
        desc: 'Pop Art',
        type: 'Illustration style',
        value: 'Pop Art',
        indexImg: 5,
      },
    ],
  },
  '5': {
    title: "Good job! You've gathered all the ingredients for your story.",
    desc:
      "Click 'Generate Story' to create your story, " +
      'or click on any of the selected ingredients to make changes.',
    variants: [],
  },
  '6': {
    title: 'Your ingredients are being mixed to create a unique story!',
    desc: 'Please wait a minute or two while we work our magic.',
    variants: [],
  },
  '7': {
    title: 'Congratulations, your story is now ready  be discovered!',
    desc:
      'Review your story to make exactly as you envision it, ' +
      'or start reading it right away.',
    variants: [],
  },
};
