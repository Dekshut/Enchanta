import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useAudio = (
  urls: string[],
): [boolean, Dispatch<SetStateAction<boolean>>] => {
  const [playing, setPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement>(
    new Audio(urls[Math.floor(Math.random() * 4)]),
  );

  const [searchParams] = useSearchParams() || '';
  const isListen = searchParams.get('listen') || '';
  const isRead = searchParams.get('read') || '';

  useEffect(() => {
    isListen ? audio.volume = 0.12 : audio.volume = 0.5;
  }, [audio, isListen, isRead]);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, audio.src]);

  useEffect(() => {
    audio.addEventListener('ended', () => {
      setAudio(new Audio(urls[Math.floor(Math.random() * 4)]));
    });
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio, isRead, isListen]);

  return [playing, setPlaying];
};
