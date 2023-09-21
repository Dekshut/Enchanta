import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { defaultImage } from '../../constants';
import { getImage } from '../../helpers';
import shareImg from '../../images/content/other/sharing.png';
import {
  ReactComponent as AddIcon,
} from '../../images/icons/other/add-icon.svg';
import {
  ReactComponent as CopyIcon,
} from '../../images/icons/social/copy-icon.svg';
import {
  ReactComponent as FacebookIcon,
} from '../../images/icons/social/facebook-icon.svg';
import {
  ReactComponent as TwitterIcon,
} from '../../images/icons/social/twitter-icon.svg';
import { useStoryStore, useSubscriptionStore } from '../../store';
import { PrimaryButton, SecondaryButton } from '../Buttons';
import './ShareStory.scss';

interface IShareStory {
  storyId: number;
  isModal?: boolean;
  sharedStory?: UserStory;
}

const ShareStory = forwardRef(({
  isModal,
  storyId,
  sharedStory,
}: IShareStory, ref: ForwardedRef<HTMLDivElement>) => {
  const [shareLink, setShareLink] = useState<string>('');
  const { fetchGetShareLink, fetchShareStory } = useStoryStore();
  const { storiesLeft } = useSubscriptionStore();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams() || '';

  useEffect(() => {
    fetchGetShareLink(storyId)
      .then((link: string) => setShareLink(link));
  }, [fetchGetShareLink, storyId]);

  const onCreateNewStory = () => {
    if (storiesLeft) {
      searchParams.delete('open-story');
      searchParams.delete('read');
      searchParams.delete('edit');
      searchParams.set('story-creator', 'on');
      searchParams.set('step', '0');
    } else {
      searchParams.set('subscription-plan', 'on');
    }
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  return (
    <div
      className={`share-story${isModal ? ' share-story--modal' : ''}`}
      ref={ref}
      tabIndex={-1}
    >
      {isModal ?
        <>
          {getImage(shareImg || defaultImage,
            'share', '120', '120', 'share-story__image')}
        </> : null}
      <h3 className="share-story__text">
        {sharedStory ?
          'Share this special creation story with your friends and family' :
          'Share your special creation with your friends and family'}
      </h3>
      <div className={`share-story__social${isModal ? ' modalView' : ''}`}>
        <FacebookShareButton url={shareLink}>
          <SecondaryButton
            asContent
            text="Facebook"
            iconPosition={'left'}
            icon={<FacebookIcon />}
            onClick={fetchShareStory}
          />
        </FacebookShareButton>
        <TwitterShareButton url={shareLink}>
          <SecondaryButton
            asContent
            text="Twitter"
            iconPosition={'left'}
            icon={<TwitterIcon />}
            onClick={fetchShareStory}
          />
        </TwitterShareButton>
      </div>
      <div className={`share-story__share-link${isModal ? ' modalView' : ''}`}>
        <span id="share-Link">{shareLink}</span>
        <CopyToClipboard key={shareLink} text={shareLink}>
          <button type="button">
            <CopyIcon
              title="Copy"
            />
          </button>
        </CopyToClipboard>
      </div>
      {isModal ? null :
        <>
          <span className="share-story__line"></span>
          {sharedStory ?
            <PrimaryButton
              iconPosition="left"
              text="Create New Story"
              icon={<AddIcon />}
              width="200px"
              onClick={() => navigate('/sign-in')}
            /> :
            <PrimaryButton
              iconPosition="left"
              text="Create New Story"
              icon={<AddIcon />}
              width="200px"
              onClick={onCreateNewStory}
            />}
        </>}
    </div>
  );
});

export default ShareStory;
