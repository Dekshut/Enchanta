import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Instruction from './Instruction';
import { useStoryStore } from '../../../../store';
import ErrorBoundary from '../../../ErrorBoundary';
import { StoryContentPortrait } from '../../../StoryContent';
import './RecordStory.scss';

function RecordStory() {
  const { readStory } = useStoryStore((store: IStoryStore) => store);
  const [searchParams] = useSearchParams() || '';
  const isInstruction = searchParams.get('instruction') || '';

  return (
    <ErrorBoundary>
      <div className="record-story">
        {isInstruction ?
          <Instruction /> :
          null}
        <div className="record-story__content" key={readStory.id}>
          {readStory ?
            <StoryContentPortrait
              isRecording
              content={readStory.story}
              storyId={readStory.id}
            /> : null}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default RecordStory;
