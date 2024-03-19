import { ArrowForwardRounded } from '@mui/icons-material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { MouseEvent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import shallow from 'zustand/shallow';
import AccountMenu from './AccountMenu';
import { bunner } from '../../animations';
import { getImage } from '../../helpers';
import { ReactComponent as Logo } from '../../images/enchanta-logo.svg';
import { ReactComponent as User } from '../../images/userCircle.svg';
import { useStoryStore, useSubscriptionStore, useUserStore } from '../../store';
import { PrimaryButton } from '../Buttons';
import './Header.scss';

function Header({ isShared }: { isShared?: boolean }) {
  const [showBunner, setShowBunner] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { storiesLeft, getUserCredits } = useSubscriptionStore(
    (state: ISubscriptionStore & ISubscriptionActions) => state,
    shallow,
  );
  const { avatar, setUser } = useUserStore();
  const { resetReadStory } = useStoryStore();

  const open = Boolean(anchorEl);
  const [searchParams] = useSearchParams() || '';
  const navigate = useNavigate();

  useEffect(() => {
    const isSharedFlow = window.location.pathname.includes('/story/');
    if (!isSharedFlow) {
      setUser();
      getUserCredits();
    }
  }, [getUserCredits, setUser]);

  useEffect(() => {
    storiesLeft ? setShowBunner(false) : setShowBunner(true);
  }, [storiesLeft]);

  const toggleAccountMenu = (event: MouseEvent<HTMLElement>): void => {
    anchorEl ? setAnchorEl(null) : setAnchorEl(event.currentTarget);
  };

  const onClosePopup = () => {
    setAnchorEl(null);
  };

  const openSubscriptionPlan = () => {
    searchParams.set('subscription-plan', 'on');
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const onBackToHome = () => {
    if (isShared) {
      navigate('/sign-in');
    } else {
      resetReadStory();
      searchParams.delete('subscription-plan');
      searchParams.delete('story-creator');
      searchParams.delete('open-story');
      searchParams.delete('step');
      searchParams.delete('read');
      searchParams.delete('edit');
      navigate(`?${searchParams.toString()}`, { replace: true });
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isShared ? null : (
          <>
            {showBunner && (
              <motion.aside
                className="bunner"
                variants={bunner}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <p className="bunner__text">
                  Unlock your powers to generate even more stories with a
                  premium subscription.
                </p>
                <button
                  type="button"
                  className="bunner__button"
                  onClick={() => openSubscriptionPlan()}
                >
                  <span className="bunner__button-text">Subscribe Now</span>
                  <ArrowForwardRounded />
                </button>
              </motion.aside>
            )}
          </>
        )}
      </AnimatePresence>
      <header className="header">
        <div className="header__container">
          <nav className="menu">
            <ul className="menu__list">
              <li className="menu__item logo">
                <button
                  className="menu__button"
                  onClick={onBackToHome}
                  type="button"
                >
                  <Logo />
                  <div className="menu__item logo__text"> Enchanta</div>
                </button>
              </li>
              {isShared ? (
                <>
                  <li className="menu__item create_own_story">
                    <PrimaryButton
                      thin
                      text="Create Your Own Story"
                      onClick={() => navigate('/sign-in')}
                      iconPosition="none"
                    />
                  </li>
                </>
              ) : (
                <>
                  <li className="menu__item">
                    <span className="menu__item-story-count">
                      {storiesLeft}
                    </span>
                    <span className="menu__item-story-desc">
                      {storiesLeft === 1 ? 'story' : 'stories'} left
                    </span>
                  </li>
                  <li className="menu__item">
                    <button
                      data-testid="toggleAccountMenu-button"
                      className="menu__button"
                      type="button"
                      onClick={toggleAccountMenu}
                    >
                      {avatar ? (
                        <>
                          {getImage(
                            avatar,
                            'avatar',
                            '40',
                            '40',
                            'menu__item-button avatar',
                          )}
                        </>
                      ) : (
                        <User
                          className={`menu__item-button user${
                            open ? ' active' : ''
                          }`}
                        />
                      )}
                    </button>
                    <AccountMenu
                      open={open}
                      anchorEl={anchorEl}
                      onToggle={toggleAccountMenu}
                      isSubscribe={!!storiesLeft}
                      openSubscriptionPlan={openSubscriptionPlan}
                      onClosePopup={onClosePopup}
                    />
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Header;
