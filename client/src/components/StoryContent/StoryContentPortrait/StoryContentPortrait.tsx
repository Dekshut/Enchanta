import React, { CSSProperties, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  updateContent,
  updateDublicate,
} from '../../../helpers';
import EditableCover from '../../EditableCover';
import EditableParagraph from '../../EditableParagraph';
import Feedback from '../../Feedback';
import ShareStory from '../../ShareStory';
import './StoryContentPortrait.scss';

interface StoryContentPortraitProps {
  isEdit?: boolean;
  isRecording?: boolean;
  content: IStoryPage[];
  onUpdate?: [
    (newText: string, currentPage: number) => void,
    (newImage: string, currentPage: number) => void];
  storyId: number;
  sharedStory?: UserStory;
}

const initialStyles: CSSProperties = {
  zIndex: undefined,
  height: undefined,
  overflowY: undefined,
};

function StoryContentPortrait({
  isEdit,
  isRecording,
  content,
  onUpdate,
  storyId,
  sharedStory,
}: StoryContentPortraitProps) {
  const newContent = updateContent(content);
  const editContent = updateDublicate(content);
  const [styles, setStyles] = useState<CSSProperties>(initialStyles);

  const [searchParams] = useSearchParams() || '';
  const isInstruction = searchParams.get('instruction') || '';
  const isPreparatory = searchParams.get('preparatory') || '';

  useEffect(() => {
    isInstruction || isPreparatory ?
      setStyles({
        zIndex: -1,
        height: '566px',
        overflowY: 'hidden',
      }) :
      setStyles(initialStyles);
  }, [isInstruction, isPreparatory]);

  return (
    <div
      className="story-content-portrait"
      style={styles}
    >
      {(isEdit ? editContent : newContent)
        .map((item: IStoryPage, index: number) => (
          <div key={item.id}>
            <EditableCover
              isEdit={isEdit}
              className={`story-content-portrait__cover${isEdit ?
                ' edit-portrait' : ''}`}
              url={item.image}
              isPortrait={true}
              pageId={item.id}
              dublicate={item?.dublicate}
              onUpdate={(newImage: string) =>
                onUpdate && onUpdate[1](newImage, index + 1)}
            />
            <div className={`story-content-portrait__text${isEdit ?
              ' edit-portrait' : ''}`}>
              <EditableParagraph
                className="edit-portrait"
                isEdit={isEdit}
                text={item.text}
                updateText={(newText: string) =>
                  onUpdate && onUpdate[0](newText, index + 1)}
              />
            </div>
          </div>
        ))
      }
      {(isEdit || isRecording) ? null :
        <>
          <div className="story-content-portrait__last-page">
            <Feedback storyId={storyId} />
          </div>
          <div className="story-content-portrait__share-story">
            <ShareStory storyId={storyId} sharedStory={sharedStory} />
          </div>
        </>}
    </div>
  );
}

export default StoryContentPortrait;
