import React, { Dispatch, SetStateAction } from 'react';
import { updateDublicate } from '../../../helpers';
import {
  ReactComponent as NextPage,
} from '../../../images/icons/reading/next-page.svg';
import {
  ReactComponent as PrevPage,
} from '../../../images/icons/reading/prev_page-icon_on.svg';
import { SecondaryButton } from '../../Buttons';
import EditableCover from '../../EditableCover';
import EditableParagraph from '../../EditableParagraph';
import Feedback from '../../Feedback';
import ShareStory from '../../ShareStory';
import './StoryContentLandscape.scss';

interface StoryContentNavigationProps {
  prevPageCb: () => void;
  isPrevDisabled: boolean;
  nextPageCb: () => void;
  isNextDisabled: boolean;
}

function StoryContentNavigation({
  prevPageCb,
  isPrevDisabled,
  nextPageCb,
  isNextDisabled,
}: StoryContentNavigationProps) {

  return (
    <div className="story-content-landscape__navigation">
      <SecondaryButton
        text="Prev Page"
        icon={<PrevPage />}
        iconPosition={'left'}
        onClick={prevPageCb}
        disabled={isPrevDisabled || false}
      />
      <SecondaryButton
        text="Next Page"
        icon={<NextPage />}
        iconPosition={'right'}
        onClick={nextPageCb}
        disabled={isNextDisabled || false}
      />
    </div>
  );
}

interface StoryContentLandscapeProps {
  isEdit?: boolean;
  content: IStoryPage[];
  onUpdate?: [
    (newText: string, currentPage: number) => void,
    (newImage: string, currentPage: number) => void];
  storyId: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  sharedStory?: UserStory;
}

function StoryContentLandscape({
  isEdit,
  content,
  onUpdate,
  storyId,
  currentPage,
  setCurrentPage,
  sharedStory,
}: StoryContentLandscapeProps) {
  const newContent = updateDublicate(content);

  return (
    <div className="story-content-landscape">
      <div className="story-content-landscape__inner">
        {currentPage > newContent.length ?
          (<>
            <div className="story-content-landscape__last-page">
              <Feedback storyId={storyId} />
            </div>
            <div className="story-content-landscape__share-story">
              <ShareStory storyId={storyId} sharedStory={sharedStory} />
            </div>
          </>) :
          (<>
            <div>
              <EditableParagraph
                isEdit={isEdit}
                text={newContent[currentPage - 1].text}
                updateText={(newText: string) =>
                  onUpdate && onUpdate[0](newText, currentPage)}
              />
            </div>
            <div>
              <EditableCover
                url={newContent[currentPage - 1].image}
                isEdit={isEdit}
                dublicate={newContent[currentPage - 1].dublicate}
                className="story-content-landscape__cover"
                pageId={newContent[currentPage - 1].id}
                onUpdate={(newImage: string) =>
                  onUpdate && onUpdate[1](newImage, currentPage)}
              />
            </div>
          </>)
        }
      </div>

      <StoryContentNavigation
        isPrevDisabled={currentPage === 1}
        isNextDisabled={currentPage === newContent.length + 1}
        prevPageCb={() => setCurrentPage(currentPage - 1)}
        nextPageCb={() => setCurrentPage(currentPage + 1)}
      />
    </div>
  );
}

export default StoryContentLandscape;
