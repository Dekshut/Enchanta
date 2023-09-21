export const storyIngredientsOrder: string[] = [
  'Age Group', 'Story type', 'Main character',
  'Custom name', 'Custom details', 'Random name',
  'Random details', 'Theme', 'Illustration style',
];

export const initStory: UserStory = {
  id: 0,
  title: '',
  cover: '',
  story: [],
  audioUrl: '',
  hasAudio: false,
  audioCover: '',
};

export const initCard: CardInfo = {
  step: '0',
  nextstep: '0',
  alt: '',
  desc: '',
  type: '',
  value: '',
  indexImg: -1,
};

export const initAgeGroup: CardAgeInfo = {
  step: '0',
  nextstep: '0',
  alt: '',
  desc: '',
  key: 'baby',
  type: '',
  value: '',
  indexImg: -1,
};

export const initStoryType: CardStoryTypeInfo = {
  step: '0',
  nextstep: '0',
  alt: '',
  desc: '',
  location: ['baby'],
  type: '',
  value: '',
  indexImg: -1,
};

export const initCharacterDetails: CardCharacterDetailsInfo = {
  step: '0',
  nextstep: '0',
  alt: '',
  desc: '',
  label: '',
  type: '',
  value: '',
  indexImg: -1,
};
