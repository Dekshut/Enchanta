import { EastRounded } from '@mui/icons-material';
import { Menu } from '@mui/material';
import Cookies from 'js-cookie';
import React, { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { externalLink } from '../../../constants';
import { getImage } from '../../../helpers';
import {
  ReactComponent as LogOut,
} from '../../../images/icons/accountMenu/log-out-icon.svg';
import {
  ReactComponent as Subscribe,
} from '../../../images/icons/accountMenu/subscription-icon.svg';
import {
  ReactComponent as Website,
} from '../../../images/icons/accountMenu/website-icon.svg';
import user from '../../../images/userCircle.svg';
import {
  useUserStore,
  useStoryStore,
  useSubscriptionStore,
} from '../../../store';
import './AccountMenu.scss';

interface AccountMenuProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onToggle: (event: MouseEvent<HTMLElement>) => void;
  isSubscribe: boolean;
  openSubscriptionPlan: () => void;
  onClosePopup: () => void;
}

function AccountMenu({
  open,
  anchorEl,
  onToggle,
  isSubscribe,
  openSubscriptionPlan,
  onClosePopup,
}: AccountMenuProps) {
  const navigate = useNavigate();
  const {
    firstName,
    lastName,
    email,
    avatar,
    resetUser,
  } = useUserStore((state: IUserStoreState & IUserStoreActions) => state);
  const {
    resetStoryStore,
  } = useStoryStore((state: IStoryActions) => state);
  const {
    resetSubscriptionStore,
  } = useSubscriptionStore((state: ISubscriptionActions) => state);

  const onLogOut = (event: MouseEvent<HTMLButtonElement>) => {
    onToggle(event);
    resetUser();
    resetStoryStore();
    resetSubscriptionStore();
    localStorage.clear();
    Cookies.remove('jwtToken');
    Cookies.remove('googleToken');
    navigate('/sign-in', { replace: true });
  };

  return (
    <Menu
      id="account-menu"
      open={open}
      anchorEl={anchorEl}
      onClose={onClosePopup}
      onClick={onClosePopup}
      hideBackdrop
      PaperProps={{
        elevation: 0,
        className: 'account-menu',
      }}
      MenuListProps={{ sx: { padding: 0 } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <div className="account-menu__user">
        {getImage(
          avatar ? avatar : user, 'user-photo',
          '80', '80', 'account-menu__user-image',
        )}
        <p className="account-menu__user-name">
          {firstName} {lastName}
        </p>
        <p className="account-menu__user-email subtitle">
          {email}
        </p>
      </div>
      <ul className="account-menu__list">
        <li className="account-menu__item">
          {isSubscribe ?
            <button
              className="account-menu__button"
              type="button"
              onClick={(event) => {
                onToggle(event);
                openSubscriptionPlan();
              }}
            >
              <Subscribe />
              <span className="account-menu__button-text">
                Manage Subscription
              </span>
            </button> :
            <button
              className="account-menu__button"
              type="button"
              onClick={(event) => {
                onToggle(event);
                openSubscriptionPlan();
              }}
            >
              <Subscribe />
              <span className="account-menu__button-text">
                Subscribe
              </span>
              <EastRounded className="arrow" />
            </button>}
        </li>
        <li className="account-menu__item">
          <a
            className="account-menu__button"
            href={externalLink.website}
            target="_blank"
            rel="noreferrer"
          >
            <Website />
            <span className="account-menu__button-text">
              Visit enchanta.ai
            </span>
          </a>
        </li>
        <li className="account-menu__item">
          <button
            data-testid="onLogOut-button"
            className="account-menu__button"
            type="button"
            onClick={(event) => onLogOut(event)}
          >
            <LogOut />
            <span className="account-menu__button-text">
              Log Out
            </span>
          </button>
        </li>
      </ul>
      <ul className="account-menu__footer">
        <li className="account-menu__footer-item">
          <a
            className="account-menu__footer-link"
            href={externalLink.termsOfService}
            target="_blank"
            rel="noreferrer"
          >
            Terms of Service
          </a>
        </li>
        <li className="account-menu__footer-item">
          <a
            className="account-menu__footer-link"
            href={externalLink.privacyPolicy}
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
        </li>
      </ul>
    </Menu>
  );
}

export default AccountMenu;
