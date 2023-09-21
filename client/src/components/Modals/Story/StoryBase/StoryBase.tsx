import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getImage } from '../../../../helpers';
import {
  ReactComponent as Record,
} from '../../../../images/icons/listening/record_black.svg';
import {
  ReactComponent as Listen,
} from '../../../../images/icons/other/listen-icon.svg';
import {
  ReactComponent as Book,
} from '../../../../images/icons/reading/read-icon.svg';
import { PrimaryButton, SecondaryButton } from '../../../Buttons';
import './StoryBase.scss';

interface StoryBaseProps {
  story: UserStory;
  onRecord: () => void;
  hasAudio: boolean;
}

function StoryBase({ story, onRecord, hasAudio }: StoryBaseProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams() || '';

  return (
    <>
      <div className="story-base__header">
        <h2 className="story-base__title title">
          How do you want to experience your story?
        </h2>
        <p className="story-base__desc subtitle">
          Each version comes with its own magic.
        </p>
      </div>
      <div className="story-base__content">
        {getImage(
          story.cover,
          story.title,
          '200', '200',
          'story-base__content-image',
        )}
        <h3 className="story-base__content-title">
          {story.title}
        </h3>
      </div>
      <div className="story-base__buttons">
        <PrimaryButton
          iconPosition="left"
          icon={<Book />}
          text="Read Storybook"
          onClick={() => {
            searchParams.set('read', `${story.id}`);
            navigate(`?${searchParams.toString()}`, { replace: true });
          }}
        />
        <SecondaryButton
          iconPosition="left"
          icon={hasAudio ? <Listen /> : <Record />}
          text={hasAudio ? 'Listen to Audiostory' : 'Record Audiostory'}
          onClick={onRecord}
        />
      </div>
    </>
  );
}

export default StoryBase;
