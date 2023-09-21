import { Menu } from '@mui/material';
import React, { Dispatch, MouseEvent, SetStateAction } from 'react';
import {
  ReactComponent as Edit,
} from '../../../../images/icons/editing/edit-icon.svg';
import {
  ReactComponent as Delete,
} from '../../../../images/icons/moreMenu/delete-icon.svg';
import {
  ReactComponent as Share,
} from '../../../../images/icons/moreMenu/share-icon.svg';
import './StoryActions.scss';

interface StoryActionsProps {
  open: boolean;
  anchorEl: null | HTMLElement;
  onToggle: (event: MouseEvent<HTMLElement>) => void;
  onEdit: () => void;
  onShare: Dispatch<SetStateAction<boolean>>;
  onRemove: Dispatch<SetStateAction<boolean>>;
  onClosePopup: () => void;
}

function StoryActions({
  open,
  anchorEl,
  onToggle,
  onEdit,
  onShare,
  onRemove,
  onClosePopup,
}: StoryActionsProps) {

  return (
    <Menu
      id="story-actions"
      open={open}
      anchorEl={anchorEl}
      onClose={onClosePopup}
      onClick={onClosePopup}
      hideBackdrop
      PaperProps={{
        elevation: 0,
        className: 'story-actions',
      }}
      MenuListProps={{ className: 'story-actions__list' }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <li className="story-actions__item">
        <button
          className="story-actions__button"
          type="button"
          onClick={(event) => {
            onToggle(event);
            onEdit();
          }}
        >
          <Edit />
          <span className="story-actions__button-text">
            Edit
          </span>
        </button>
      </li>
      <li className="story-actions__item">
        <button
          className="story-actions__button"
          type="button"
          onClick={(event) => {
            onToggle(event);
            onShare(true);
          }}
        >
          <Share />
          <span className="story-actions__button-text">
            Share
          </span>
        </button>
      </li>
      <li className="story-actions__item">
        <button
          className="story-actions__button"
          type="button"
          onClick={(event) => {
            onToggle(event);
            onRemove(true);
          }}
        >
          <Delete className="delete" />
          <span className="story-actions__button-text delete">
            Delete
          </span>
        </button>
      </li>
    </Menu>
  );
}

export default StoryActions;
