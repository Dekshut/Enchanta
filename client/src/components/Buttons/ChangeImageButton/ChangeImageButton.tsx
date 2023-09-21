import React from 'react';
import {
  ReactComponent as ChangeIcon,
} from '../../../images/icons/editing/change_img-icon.svg';
import './ChangeImageButton.scss';

interface IChangeImageButton {
  isPortrait?: boolean;
  onClick: () => void;
  disabled?: boolean;
  isListen?: boolean;
}

function ChangeImageButton({
  isPortrait,
  onClick,
  disabled,
  isListen,
}: IChangeImageButton) {

  return (
    <button
      className={`change-image-button${isPortrait ?
        ' edit-portrait' : ''}${isListen ?
        ' listen' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span><ChangeIcon /></span>
      Change Image
    </button>
  );
}

export default ChangeImageButton;
