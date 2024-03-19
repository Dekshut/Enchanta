import React, { useState } from 'react';
import { ReactComponent as DiscardIcon } from '../../images/icons/editing/close-icon.svg';
import { ReactComponent as EditIcon } from '../../images/icons/editing/edit-icon.svg';
import { ReactComponent as ApplyIcon } from '../../images/icons/editing/save-icon_on.svg';
import { useStoryStore } from '../../store';
import './StoryTitle.scss';

interface StoryTitleProps {
  isEdit: boolean;
  isRecord?: boolean;
  title: string;
  story: UserStory;
}

function StoryTitle({ isEdit, title, story, isRecord }: StoryTitleProps) {
  const [isEditable, setEditable] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const { updateStory, editableStory } = useStoryStore(
    (state: IStoryStore & IStoryActions) => state,
  );

  if (isEditable)
    return (
      <label className="story-title editable">
        <span className="story-title__tag">Editing</span>
        <input
          type="text"
          placeholder={editableStory.title}
          autoFocus
          value={inputValue}
          onBlur={() => {
            story && updateStory(story.id, 0, null, null, inputValue);
            setInputValue('');
            setEditable(false);
          }}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <span
          className="story-title__icon apply"
          style={{ opacity: inputValue.length ? 1 : 0.08 }}
          onClick={() => {
            story && updateStory(story.id, 0, null, null, inputValue);
            setInputValue('');
            setEditable(false);
          }}
        >
          <ApplyIcon />
        </span>
        <span
          className="story-title__discard"
          onClick={() => {
            setInputValue('');
            setEditable(false);
          }}
        >
          <DiscardIcon />
        </span>
      </label>
    );
  else if (isEdit && !isRecord)
    return (
      <h2 className="story-title editable">
        <div className="story-title__tag">Editing</div>
        <span className="story-title__title">{editableStory.title}</span>
        <div
          className="story-title__icon edit"
          onClick={() => {
            setEditable(true);
          }}
        >
          <EditIcon />
        </div>
      </h2>
    );
  else return <h2 className="story-title">{title}</h2>;
}

export default StoryTitle;
