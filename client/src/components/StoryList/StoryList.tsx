import { AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { initStory } from '../../constants';
import { useStoryStore } from '../../store';
import { Story } from '../Modals';
import StoryItem from '../StoryItem';
import StoryItemAdd from '../StoryItemAdd';
import './StoryList.scss';

function StoryList() {
  const {
    userStories,
  } = useStoryStore((state: IStoryStore) => state);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams() || '';
  const isStoryOpen = searchParams.get('open-story') || '';
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);

  const openStory = (storyId: number) => {
    setSelectedStory(userStories.filter(s => s.id === storyId)[0]);
    searchParams.set('open-story', `${storyId}`);
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const onChangeSelectedStory = (storyId: number) => {
    setSelectedStory(userStories.filter(s => s.id === storyId)[0]);
  };

  return (
    <>
      <section className="user-stories">
        <h1 className="user-stories__title title">My Stories</h1>
        <ul className="user-stories__list">
          <li className="user-stories__item" key={0}>
            <StoryItemAdd />
          </li>
          {userStories.map((story: UserStory) => (
            <li key={story.id} className="user-stories__item">
              <StoryItem
                onClick={openStory}
                story={story}
                selectedStory={selectedStory || story}
                onChangeSelectedStory={onChangeSelectedStory}
              />
            </li>
          ))}
        </ul>
      </section>
      <AnimatePresence mode="wait">
        {!!isStoryOpen &&
          <Story
            story={selectedStory ? selectedStory : initStory}
          />}
      </AnimatePresence>
    </>
  );
}

export default StoryList;
