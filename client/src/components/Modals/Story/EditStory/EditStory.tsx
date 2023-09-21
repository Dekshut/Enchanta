import React, { Dispatch, SetStateAction } from 'react';
import { getWindowDimensions } from '../../../../helpers';
import { useStoryStore } from '../../../../store';
import
StoryContentLandscape
  from '../../../StoryContent/StoryContentLandscape/StoryContentLandscape';
import
StoryContentPortrait
  from '../../../StoryContent/StoryContentPortrait/StoryContentPortrait';

interface EditStoryProps {
  viewMode: string;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  keyEdit: string;
  setKeyEdit: Dispatch<SetStateAction<string>>;
}

function EditStory({
  keyEdit,
  setKeyEdit,
  viewMode,
  currentPage,
  setCurrentPage,
}: EditStoryProps) {
  const { updateStory, editableStory } =
    useStoryStore((state: IStoryStore & IStoryActions) => state);
  const { width } = getWindowDimensions();

  const onUpdateText = (newText: string, currentPage: number) => {
    setKeyEdit(newText);
    updateStory(editableStory.id, currentPage, newText);
  };
  const onUpdateImage = (newImage: string, currentPage: number) => {
    setKeyEdit(newImage);
    updateStory(editableStory.id, currentPage, null, newImage);
  };

  return (
    <div className="read-story">
      <div className="read-story">
        <div className="read-story__content">
          {viewMode === 'landscape' && width >=950 ?
            <StoryContentLandscape
              key={keyEdit}
              isEdit={true}
              content={editableStory.story}
              storyId={editableStory.id}
              onUpdate={[onUpdateText, onUpdateImage]}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            /> :
            <StoryContentPortrait
              key={keyEdit}
              isEdit={true}
              content={editableStory.story}
              storyId={editableStory.id}
              onUpdate={[onUpdateText, onUpdateImage]} />}
        </div>
      </div>
    </div>
  );
}

export default EditStory;
