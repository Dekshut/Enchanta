import axios from 'axios';
import { AnimatePresence } from 'framer-motion';
import { Configuration, OpenAIApi } from 'openai';
import React, { useEffect } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import ErrorBoundary from '../../components/ErrorBoundary';
import Header from '../../components/Header';
import { NewStory, SubscriptionPlan } from '../../components/Modals';
import StoryItemAdd from '../../components/StoryItemAdd';
import StoryList from '../../components/StoryList';
import {
  API,
  config,
  useStoryStore,
  useSubscriptionStore,
  useUserStore,
} from '../../store';

const prompt =
  'Create a rhyming counting story appropriate for children ages 0-2. The story should alternatively count to 3 or 5 using words like "one, two, buckle my shoe" or "one, two, three, listen to me". The story should feature objects or items familiar to young children, such as toys, foods, or clothing items. On every line must be up to 8 words. The length of story should be minimum 50 words. The story should rhyme and use repetition to make it easy for children to follow along.';

const openAi = new OpenAIApi(
  new Configuration({
    apiKey: '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',
  }),
);

const openAiConfig = {
  model: 'davinci-002',
  temperature: 0.7,
  max_tokens: 3000,
  top_p: 1.0,
  frequency_penalty: 0,
  presence_penalty: 0,
};

// const openAi = new OpenAI({ apiKey, dangerouslyAllowBrowser: true });

const updateTime = () => axios.post(`${API}/api/user/session-time`, {}, config);

const onClick = async () => {
  const result = await openAi.createCompletion({
    ...openAiConfig,
    prompt: `${prompt}`,
  });

  console.log(result);
};
// openAi.images.generate({
//   prompt:
//     'An idyllic town with Enchanta, a cheerful girl, standing in front of her magical, stardust-covered house.',
//   n: 1,
//   size: '256x256',
//   response_format: 'b64_json',
// }),

function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams() || '';
  const sessionId = searchParams.get('session_id') || '';
  const createStory = searchParams.get('story-creator') || '';
  const openStory = searchParams.get('open-story') || '';
  const subscriptionPlan = searchParams.get('subscription-plan') || '';
  const { userStories, getUserStories } = useStoryStore(
    (store: IStoryStore & IStoryActions) => store,
  );
  const { setSessionInfo } = useSubscriptionStore(
    (store: ISubscriptionActions) => store,
  );
  const { email } = useUserStore((store: IUserStoreState) => store);

  useEffect(() => {
    setInterval(() => {
      updateTime();
    }, 60 * 1000);
  }, []);

  useEffect(() => {
    if (email) {
      getUserStories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  useEffect(() => {
    if (sessionId) {
      setSessionInfo(sessionId);
      searchParams.delete('session_id');
      navigate(`?${searchParams.toString()}`, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    const divEl = document.getElementById('root');
    const bodyEl = document.getElementsByTagName('body')[0];

    if (
      (!!createStory || !!openStory || !!subscriptionPlan) &&
      divEl &&
      bodyEl
    ) {
      divEl.style.overflow = 'hidden';
      bodyEl.style.overflow = 'hidden';
    } else if (divEl && bodyEl) {
      divEl.style.overflow = 'auto';
      bodyEl.style.overflowY = 'auto';
      bodyEl.style.overflowX = 'hidden';
    }
  }, [createStory, openStory, subscriptionPlan]);

  return (
    <ErrorBoundary>
      <main className="dashboard">
        <Header />
        <div className="dashboard__content">
          <div className="dashboard__container">
            {userStories.length ? (
              <StoryList />
            ) : (
              <section className="dashboard__empty">
                <h1 className="dashboard__empty-title title">
                  There are no stories yet, but don&apos;t worry!
                </h1>
                <p className="dashboard__empty-description">
                  Our magician is here to help you create amazing stories.
                  Let&apos;s get started!
                </p>
                <StoryItemAdd />
              </section>
            )}
          </div>
        </div>
        <button onClick={onClick}>Generate</button>
      </main>
      <AnimatePresence mode="wait">
        {!!createStory && <NewStory />}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {!!subscriptionPlan && <SubscriptionPlan />}
      </AnimatePresence>
    </ErrorBoundary>
  );
}

export default Dashboard;
