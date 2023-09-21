import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const initBlob = new Blob();

const initState: IRecordStore = {
  permission: false,
  stream: null,
  recordStatus: 'inactive',
  audioChunks: [],
  audio: undefined,
  audioBlob: initBlob,
};

export const useRecordStore = create<IRecordStore & IRecordActions>()(
  devtools(
    persist((set) => ({
      ...initState,
      setPermission: (permission: boolean) => set({ permission }),
      setStream: (stream: MediaStream | null) => set({ stream }),
      setRecordStatus: (recordStatus: RecordStatus) => set({ recordStatus }),
      setAudioChunks: (audioChunks: Blob[]) => set({ audioChunks }),
      setAudio: (audio: string | undefined) => set({ audio }),
      setAudioBlob: (audioBlob: Blob) => set({ audioBlob }),
      resetRecordStore: () => set({ ...initState }),
    }),
    {
      name: 'record',
    },
    )
  )
);
