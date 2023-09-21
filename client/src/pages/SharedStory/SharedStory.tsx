import { PauseRounded } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import AudioPlayer from '../../components/AudioPlayer';
import { OverlayButton } from '../../components/Buttons';
import ErrorBoundary from '../../components/ErrorBoundary';
import Header from '../../components/Header';
import ListenStory from '../../components/Modals/Story/ListenStory';
import ReadStory from '../../components/Modals/Story/ReadStory';
import StoryTitle from '../../components/StoryTitle';
import ViewSwitch from '../../components/ViewSwitch';
import { music } from '../../constants';
import { getWindowDimensions } from '../../helpers';
import { useAudio } from '../../hooks';
import {
  ReactComponent as Read,
} from '../../images/icons/listening/read.svg';
import {
  ReactComponent as AmbientMusic,
} from '../../images/icons/other/ambient_music-icon.svg';
import {
  ReactComponent as Listen,
} from '../../images/icons/other/listen-icon.svg';
import { useStoryStore } from '../../store';
import './SharedStory.scss';

function SharedStory() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sharedStory, setSharedStory] = useState<UserStory | null>(null);
  const [regime, setRegime] = useState<'read' | 'listen'>('read');
  const [viewMode, setViewMode] = useState<ViewStory>('landscape');
  const [playing, setPlaying] = useAudio(music);

  const {
    fetchGetSharedStory,
    fetchPlayAmbient,
  } = useStoryStore(state => state);
  const link = window.location.href.split('/').reverse()[0];

  const { width } = getWindowDimensions();

  useEffect(() => {
    fetchGetSharedStory(link)
      .then((story: UserStory | null) => setSharedStory(story));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchGetSharedStory]);

  return (
    <ErrorBoundary>
      <main className="shared">
        <Header isShared />
        <div className="shared__title">
          {sharedStory?.title && (<StoryTitle
            title={sharedStory.title}
            story={sharedStory}
            isEdit={false} />)}
        </div>
        <div className="shared__content">
          <div className="shared__container">
            {sharedStory && regime === 'read' &&
              <ReadStory
                viewMode={viewMode}
                sharedStory={sharedStory}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />}
            {sharedStory && regime === 'listen' &&
              <ListenStory story={sharedStory} />}
          </div>
        </div>
        {sharedStory && regime === 'read' &&
          <div className="read-story__overlay sharedStory">
            <OverlayButton
              text="Ambient Music"
              icon={playing ?
                <PauseRounded titleAccess="Pause" /> :
                <AmbientMusic title="Play" />}
              onClick={() => {
                !playing && fetchPlayAmbient();
                setPlaying(!playing);
              }}
            />
            {width > 950 &&
              <ViewSwitch mode={viewMode} setMode={setViewMode} />}
            <OverlayButton
              disabled={!sharedStory.hasAudio}
              text="Listen to Audiostory"
              icon={<Listen />}
              onClick={() => {
                setRegime('listen');
                setPlaying(false);
              }}
            />
          </div>}
        {sharedStory && regime === 'listen' &&
          <div className="read-story__overlay sharedStory">
            <OverlayButton
              text="Ambient Music"
              icon={playing ?
                <PauseRounded titleAccess="Pause" /> :
                <AmbientMusic title="Play" />}
              onClick={() => {
                !playing && fetchPlayAmbient();
                setPlaying(!playing);
              }}
            />
            <AudioPlayer audio={sharedStory.audioUrl} />
            <OverlayButton
              text="Read Storybook"
              icon={<Read />}
              onClick={() => {
                setRegime('read');
                setPlaying(false);
              }}
            />
          </div>}
      </main>
    </ErrorBoundary>
  );
}

export default SharedStory;
