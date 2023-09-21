/// <reference types="react-scripts" />

declare global {

  interface IStoryPage {
    id: number;
    text: string;
    image: string;
    dublicate?: boolean;
  }

  interface UserStory {
    id: number;
    title: string;
    cover: string;
    story: IStoryPage[];
    audioUrl: string;
    hasAudio: boolean;
    audioCover: string;
  }

  interface Subscribe {
    title: string;
    value: number;
    sub: string;
    desc1: string;
    desc2: string;
    desc3: string;
    id: string;
  }

  interface Subscriptions {
    monthly: Subscribe[];
    annual: Subscribe[];
    payPerStory: Subscribe[];
  }

  type ViewStory = 'landscape' | 'portrait';
  type RecordStatus = 'recording' | 'inactive' | 'paused';

  // ===== create story ===== //

  type Steps = '0' | '1' | '2' | '2.1' | '2.2' | '3' | '4' | '5' | '6' | '7';
  type ChildGroup = 'baby' | 'preschool' | 'school';

  type CardInfo = {
    indexImg: number;
    step: Steps;
    nextstep: Steps;
    alt: string;
    desc: string;
    type: string;
    value: string
    | StoryTheme
    | StoryIllustration
    | StoryType
    | StoryMainCharacter
    | AgeGroup;
  };

  type CardAgeInfo = CardInfo & { key: ChildGroup };
  type CardStoryTypeInfo = CardInfo & { location: ChildGroup[] };
  type CardCharacterDetailsInfo = CardInfo & { label: string };

  type Cards = CardInfo
    | CardAgeInfo
    | CardStoryTypeInfo
    | CardCharacterDetailsInfo;

  type StoryTheme = 'Friendship'
    | 'Family'
    | 'Emotions'
    | 'Courage'
    | 'Responsibility'
    | 'Perseverance';

  type StoryIllustration = 'Hand-drawn'
    | 'Comic Book'
    | 'Watercolor'
    | 'Ink'
    | 'Linocut'
    | 'Pop Art';

  type StoryType = 'Counting'
    | 'Nursery Rhyme'
    | 'Bedtime Story'
    | 'Fairy tale'
    | 'Poetry';

  type StoryMainCharacter = 'Man'
    | 'Woman'
    | 'Boy'
    | 'Girl'
    | 'Animal'
    | 'Fantastical Creature';

  type AgeGroup = '2' | '5' | '8';

  interface CreateStoryData {
    age: AgeGroup;
    story_type: StoryType;
    style: StoryIllustration;
    main_character?: StoryMainCharacter;
    character_name?: string;
    story_theme?: StoryTheme;
  }

  // ===== store ====== //

  interface IUserStoreState {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
  }

  interface IUserStoreActions {
    setUser: () => void;
    resetUser: () => void;
  }

  interface IStoryStore {
    userStories: UserStory[];
    editableStory: UserStory;
    generatedStoryId: number;
    sharedStory: UserStory | null;
    readStory: UserStory;
    errorCreate: boolean;
    newAudio: string;
  }

  interface IStoryActions {
    fetchShareStory: () => void;
    fetchPlayAmbient: () => void;
    getUserStories: () => Promise<void>;
    generateStory: (data: CreateStoryData) => Promise<void>;
    checkNewStory: (id: number) => Promise<void>;
    resetGeneratedStoryId: () => void;
    resetReadStory: () => void;
    resetErrorCreate: () => void;
    updateStory: (
      storyId: number,
      currentPage: number,
      newText?: string | null,
      newImage?: string | null,
      newName?: string | null,
    ) => void;
    copyStory: (storyId: number) => void;
    setStory: (storyId: number) => void;
    deleteStory: (storyId: number) => void;
    getStoryById: (storyId: string) => void;
    fetchUpdateStory: (story: UserStory) => Promise<void>;
    fetchDeleteStory: (storyId: number) => Promise<void>;
    fetchGenerateImage: (pageId: number) => Promise<string>;
    fetchGetShareLink: (storyId: number) => Promise<string>;
    fetchGetSharedStory: (link: string) => Promise<UserStory | null>;
    fetchFeedback: (
      { storyId, rate, text }:
        { storyId: number, rate: number, text: string }
    ) => Promise<void>;
    resetStoryStore: () => void;
    saveAudio: ({
      storyId, audio,
    }: { storyId: number, audio: Blob }) => Promise<void>;

    updateStoryAudioCover: (storyId: number, newAudioCover: string) => void
    resetNewAudio: () => void;
  }

  interface ISubscriptionStore {
    storiesLeft: number;
    stripeUrl: string;
  }
  interface ISubscriptionActions {
    getUserCredits: () => Promise<void>;
    getStripeUrl: (data: CheckoutUrlParams) => Promise<void>;
    setSessionInfo: (sessionId: string) => Promise<void>;
    resetSubscriptionStore: () => void;
    resetStripeUrl: () => void;
  }

  interface IRecordStore {
    permission: boolean;
    stream: MediaStream | null;
    recordStatus: RecordStatus;
    audioChunks: Blob[];
    audio: string | undefined;
    audioBlob: Blob;
  }

  interface IRecordActions {
    setPermission: (permission: boolean) => void;
    setStream: (stream: MediaStream | null) => void;
    setRecordStatus: (recordStatus: RecordStatus) => void;
    setAudioChunks: (audioChunks: Blob[]) => void;
    setAudio: (audio: string | undefined) => void;
    setAudioBlob: (audio: Blob) => void;
    resetRecordStore: () => void;
  }

  interface CheckoutUrlParams {
    priceId: string,
    email: string,
  }
}

export { };
