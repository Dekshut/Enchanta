import React from 'react';
import { getImage } from '../../helpers';
import { MoreButton } from '../Buttons';
import './StoryItem.scss';

interface StoryItemProps {
  story: UserStory;
  onClick: (id: number) => void;
  selectedStory: UserStory;
  onChangeSelectedStory: (id: number) => void;
}

function StoryItem({
  story,
  onClick,
  selectedStory,
  onChangeSelectedStory,
}: StoryItemProps) {

  return (
    <article className="story-item">
      <div
        className="story-item__more"
        onClick={() => onChangeSelectedStory(story.id)}
      >
        <MoreButton story={selectedStory} />
      </div>
      <button
        className="story-item__button"
        type="button"
        onClick={() => onClick(story.id)}
      >
        {getImage(
          story.cover, story.title,
          '200', '200', 'story-item__image')}
        <h3 className="story-item__title">
          {story.title}
        </h3>
      </button>
    </article>
  );
}

export default StoryItem;
