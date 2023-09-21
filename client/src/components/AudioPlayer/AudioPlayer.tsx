import getBlobDuration from 'get-blob-duration';
import React, { useEffect, useRef, useState } from 'react';
import {
  ReactComponent as Pause,
} from '../../images/icons/listening/pause_rec_white.svg';
import {
  ReactComponent as Play,
} from '../../images/icons/listening/play.svg';
import {
  ReactComponent as Back,
} from '../../images/icons/listening/skip_back.svg';
import {
  ReactComponent as Forward,
} from '../../images/icons/listening/skip_forward.svg';
import './AudioPlayer.scss';

interface AudioPlayerProps {
  audio: string;
}

function AudioPlayer({ audio }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioPlayer = useRef<HTMLAudioElement>(null);
  const progressBar = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number>(0);

  if (audio) (async function () {
    const duration = await getBlobDuration(audio);
    setDuration(duration);
  })();

  useEffect(() => {
    if (progressBar.current?.value &&
      (+progressBar.current?.value === Math.floor(duration))) {
      setIsPlaying(false);
      cancelAnimationFrame(animationRef.current);
    }
  }, [duration, progressBar.current?.value]);

  const calculateTime = (sec: number) => {
    if (Number.isNaN(sec)) {
      return '--:--';
    } else {
      const minutes = Math.floor(sec / 60);
      const returnedMinutes = minutes < 10 ?
        `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(sec % 60);
      const returnedSeconds = seconds < 10 ?
        `0${seconds}` : `${seconds}`;
      return `${returnedMinutes}:${returnedSeconds}`;
    }
  };

  const changeRange = () => {
    if (audioPlayer.current && progressBar.current) {
      audioPlayer.current.currentTime = +progressBar.current.value;
      setCurrentTime(progressBar.current?.value ?
        +progressBar.current?.value : 0);
    }
  };

  const togglePlayPause = () => {
    const prevValue = isPlaying;
    setIsPlaying(!prevValue);
    if (!prevValue) {
      audioPlayer.current?.play();
      animationRef.current = requestAnimationFrame(whilePlaying);
    } else {
      audioPlayer.current?.pause();
      cancelAnimationFrame(animationRef.current);
    }
  };

  const whilePlaying = () => {
    if (audioPlayer.current && progressBar.current) {
      progressBar.current.value = audioPlayer.current.currentTime.toString();
      setCurrentTime(progressBar.current?.value ?
        +progressBar.current?.value : 0);
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  };

  const onBack = () => {
    if (progressBar.current) {
      progressBar.current.value = (+progressBar.current.value - 5).toString();
      changeRange();
    }
  };

  const onForward = () => {
    if (progressBar.current) {
      progressBar.current.value = (+progressBar.current.value + 5).toString();
      changeRange();
    }
  };

  const durationTime = calculateTime(duration);

  return (
    <div className="audio-player">
      <audio
        id="audio-player__meta"
        className="audio-player__meta"
        ref={audioPlayer}
        src={audio}
        controls
        controlsList="nodownload"
        preload="metadata"
      />
      <div className="audio-player__inner">
        <div className="audio-player__buttons">
          <button
            className="audio-player__button audio-player__button-back"
            onClick={onBack}
          >
            <Back />
          </button>
          <button
            className="audio-player__button audio-player__button-play"
            onClick={togglePlayPause}>
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button
            className="audio-player__button audio-player__button-forward"
            onClick={onForward}
          >
            <Forward />
          </button>
        </div>
        <div className="audio-player__timeline">
          <div className="audio-player__timeline-time">
            {calculateTime(currentTime)}
          </div>
          <input
            className="audio-player__timeline-range"
            type="range"
            min={0}
            max={Math.floor(duration)}
            defaultValue={0}
            ref={progressBar}
            onChange={changeRange}
          />
          <div className="audio-player__timeline-time">
            {durationTime}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AudioPlayer;
