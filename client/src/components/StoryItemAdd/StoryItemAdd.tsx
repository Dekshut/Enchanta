import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ReactComponent as Add } from '../../images/icons/other/add-icon.svg';
import { useSubscriptionStore } from '../../store';
import './StoryItemAdd.scss';

function StoryItemAdd() {
  const [searchParams] = useSearchParams() || '';
  const navigate = useNavigate();
  const {
    storiesLeft,
  } = useSubscriptionStore((store: ISubscriptionStore) => store);

  const onClick = () => {
    if (storiesLeft) {
      searchParams.set('story-creator', 'on');
      searchParams.set('step', '0');
    } else {
      searchParams.set('subscription-plan', 'on');
    }
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  return (
    <button
      className="story-item-add"
      type="button"
      onClick={onClick}
    >
      <Add />
      <p className="story-item-add__text">
        Create a New Story
      </p>
    </button>
  );
}

export default StoryItemAdd;
