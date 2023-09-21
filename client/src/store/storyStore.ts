import axios from 'axios';
import Cookies from 'js-cookie';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { initStory } from '../constants';
import { API, config } from '.';

const initState: IStoryStore = {
  userStories: [],
  editableStory: {
    id: 9999,
    title: '',
    cover: '',
    story: [],
    audioUrl: '',
    hasAudio: false,
    audioCover: '',
  },
  generatedStoryId: 0,
  sharedStory: null,
  readStory: initStory,
  errorCreate: false,
  newAudio: '',
};

export const useStoryStore = create<IStoryStore & IStoryActions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initState,
        fetchShareStory: () => {
          axios.get(`${API}/api/story/share-story`, config)
            .catch(console.log);
        },
        fetchPlayAmbient: () => {
          axios.get(`${API}/api/story/play-ambient`, config)
            .catch(console.log);
        },
        getUserStories: async () => {
          try {
            const response = await axios
              .get(`${API}/api/story/get-user-story`, config);
            set({ userStories: response.data });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error['response']?.status === 401) {
              Cookies.remove('jwtToken');
              window.location.href = '/sign-in';
            }
            // eslint-disable-next-line no-console
            console.log(error);
          }
        },
        updateStoryAudioCover: (
          storyId: number,
          newAudioCover: string
        ) => set(state => {
          return {
            ...state,
            editableStory: {
              ...state.editableStory,
              audioCover: newAudioCover,
            }
          };
        }),
        updateStory: (
          storyId: number,
          currentPage?: number | null,
          newText?: string | null,
          newImage?: string | null,
          newName?: string | null,
        ) => set(state => {
          state.editableStory.title = newName || state.editableStory.title;
          if (currentPage) {
            if (newImage) {
              const hasDublicateImage = state.editableStory.story
                .filter((page: IStoryPage) =>
                  page.image === state.editableStory
                    .story[(currentPage || 0) - 1].image).length > 1;

              if (hasDublicateImage) {
                state.editableStory.story
                  .filter((page: IStoryPage) =>
                    page.image === state.editableStory
                      .story[currentPage - 1].image)
                  .forEach((page: IStoryPage) => {
                    page.image = newImage;
                  });
              }
            }

            state.editableStory.story[currentPage - 1] = {
              id: state.editableStory.story[currentPage - 1].id,
              text: newText ||
                state.editableStory.story[currentPage - 1].text,
              image: newImage ||
                state.editableStory.story[currentPage - 1].image,
            };
          }
          return state;
        }),
        deleteStory: (storyId: number) => set(state => {
          return {
            ...state,
            userStories: state.userStories.filter(s => s.id !== storyId)
          };
        }),
        copyStory: (storyId: number) => set(state => {
          const editableStory = state.userStories.find(s => s.id === storyId);
          return {
            ...state,
            editableStory: JSON.parse(JSON.stringify(editableStory))
          };
        }),
        setStory: (storyId: number) => set(state => {
          return {
            ...state,
            userStories: state.userStories.map(s => {
              if (s.id === storyId) {
                s.title = state.editableStory.title;
                if (state.editableStory.audioCover) {
                  s.audioCover = state.editableStory.audioCover;
                }
                s.story.forEach((p, i) => {
                  p.id = state.editableStory.story[i].id;
                  p.text = state.editableStory.story[i].text;
                  p.image = state.editableStory.story[i].image;
                });
              }
              return s;
            })
          };
        }),
        fetchGenerateImage: async (pageId: number) => {
          try {
            const res = await axios.get(
              `${API}/api/page/generate-image?page_id=${pageId}`,
              config
            );
            return res.data || '';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error['response']?.status === 401) {
              Cookies.remove('jwtToken');
              window.location.href = '/sign-in';
            }
          }
        },
        fetchUpdateStory: async (story: UserStory) => {
          try {
            await axios.post(`${API}/api/story/update-story`, story, config);
            get().getStoryById(`${story.id}`);
            await get().getUserStories();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error['response']?.status === 401) {
              Cookies.remove('jwtToken');
              window.location.href = '/sign-in';
            }
          }
        },
        fetchDeleteStory: async (storyId: number) => {
          try {
            await axios.delete(
              `${API}/api/story/delete-story?story_id=${storyId}`,
              config
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error['response']?.status === 401) {
              Cookies.remove('jwtToken');
              window.location.href = '/sign-in';
            }
          }
        },
        fetchGetShareLink: async (storyId: number) => {
          try {
            const res = await axios.get(
              `${API}/api/story/share-link?story_id=${storyId}`,
              config
            );
            return res.data;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error['response']?.status === 401) {
              Cookies.remove('jwtToken');
              window.location.href = '/sign-in';
            }
          }
        },
        fetchGetSharedStory: async (shareLink: string) => {
          try {
            const res = await axios.get(
              `${API}/api/story/shared-story?link=${shareLink}`,
              config
            );
            return {
              ...res.data,
              story: res.data.page
            };
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error['response']?.status === 401) {
              Cookies.remove('jwtToken');
              window.location.href = '/sign-in';
            }
          }
        },
        fetchFeedback: async ({ storyId, rate, text }) => {
          try {
            await axios.post(
              `${API}/api/story/feedback`,
              { story_id: storyId, rate, feedback: text },
              config
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error['response']?.status === 401) {
              Cookies.remove('jwtToken');
              window.location.href = '/sign-in';
            }
          }
        },
        generateStory: async (data: CreateStoryData) => {
          try {
            const response = await axios
              .post(`${API}/api/story/create`, data, config);
            set({
              generatedStoryId: response.data.id,
            });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error['response']?.status === 401) {
              Cookies.remove('jwtToken');
              window.location.href = '/sign-in';
            } else set({
              errorCreate: true,
            });
          }
        },
        getStoryById: async (id: string) => {
          try {
            const response = await axios
              .get(`${API}/api/story/get-story-by-id?story_id=${id}`, config);
            set({ readStory: response.data });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error['response']?.status === 401) {
              Cookies.remove('jwtToken');
              window.location.href = '/sign-in';
            }
          }
        },
        checkNewStory: async (id: number) => {
          try {
            const response = await axios.get(
              `${API}/api/story/status?story_id=${id}`,
              config,
            );
            if (response.data && response.data === 'ok') {
              get().getStoryById(`${id}`);
              get().getUserStories();
            } else {
              setTimeout(() => get().checkNewStory(id), 20000);
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error['response']?.status === 401) {
              Cookies.remove('jwtToken');
              window.location.href = '/sign-in';
            } else setTimeout(() => get().checkNewStory(id), 20000);
          }
        },
        saveAudio: async ({
          storyId, audio,
        }: { storyId: number, audio: Blob }) => {
          const formData = new FormData();
          formData.append('file', audio);
          formData.append('storyId', storyId.toString());

          try {
            const response = await axios.post(
              `${API}/api/story/audio`, formData, config);
            set({ newAudio: response.data });
            get().getStoryById(`${storyId}`);
            get().getUserStories();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (error: any) {
            if (error['response']?.status === 401) {
              Cookies.remove('jwtToken');
              window.location.href = '/sign-in';
            }
          }
        },
        resetNewAudio: () => set({ newAudio: '' }),
        resetGeneratedStoryId: () => set({ generatedStoryId: 0 }),
        resetErrorCreate: () => set({ errorCreate: false }),
        resetReadStory: () => set({ readStory: initStory }),
        resetStoryStore: () => set({ ...initState }),
      }),
      {
        name: 'stories',
      },
    ),
  ),
);
