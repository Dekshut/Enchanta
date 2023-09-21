import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { getWindowDimensions } from '../../../../helpers';
import { useStoryStore } from '../../../../store';
import ErrorBoundary from '../../../ErrorBoundary';
import StoryContentLandscape
  from '../../../StoryContent/StoryContentLandscape/StoryContentLandscape';
import StoryContentPortrait
  from '../../../StoryContent/StoryContentPortrait/StoryContentPortrait';
import './ReadStory.scss';

interface IReadStory {
  viewMode: string;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  sharedStory?: UserStory;
}

function ReadStory({
  viewMode,
  currentPage,
  setCurrentPage,
  sharedStory,
}: IReadStory) {
  const { readStory } = useStoryStore((store: IStoryStore) => store);
  const [story, setStory] = useState<UserStory>(readStory);
  const { width } = getWindowDimensions();

  useEffect(() => {
    if (sharedStory) {
      setStory(sharedStory);
    } else {
      setStory(readStory);
    }
  }, [readStory, sharedStory]);

  return (
    <ErrorBoundary>
      <div className="read-story">
        <div className="read-story__content" key={story?.id}>
          {story ?
            <>{viewMode === 'landscape' && width >= 950 ?
              <StoryContentLandscape
                content={story.story}
                storyId={story.id}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                sharedStory={sharedStory}
              /> :
              <StoryContentPortrait
                content={story.story}
                storyId={story.id}
                sharedStory={sharedStory}
              />
            }</> : null}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default ReadStory;
