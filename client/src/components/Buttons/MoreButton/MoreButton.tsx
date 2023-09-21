import { Modal } from '@mui/material';
import React, { MouseEvent, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import StoryActions from './StoryActions';
import {
  ReactComponent as More,
} from '../../../images/icons/moreMenu/more-icon.svg';
import { useStoryStore } from '../../../store';
import { DeleteStory } from '../../Modals';
import ShareStory from '../../ShareStory';
import './MoreButton.scss';

interface MoreButtonProps {
  story: UserStory;
  modal?: boolean;
}

function MoreButton({
  story,
  modal,
}: MoreButtonProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [remove, setRemove] = useState<boolean>(false);
  const [share, setShare] = useState<boolean>(false);

  const open = Boolean(anchorEl);
  const [searchParams] = useSearchParams() || '';
  const navigate = useNavigate();
  const isListen = searchParams.get('listen') || '';
  const isRead = searchParams.get('read') || '';

  const shareRef = useRef<HTMLDivElement>(null);
  const deleteRef = useRef<HTMLDivElement>(null);

  const {
    deleteStory,
    fetchDeleteStory,
    resetReadStory,
  } = useStoryStore();

  const toggleStoryActions = (event: MouseEvent<HTMLElement>): void => {
    anchorEl ? setAnchorEl(null) :
      setAnchorEl(event.currentTarget);
  };

  const onClosePopup = () => {
    setAnchorEl(null);
  };

  const onEdit = () => {
    searchParams.set('open-story', `${story.id}`);
    !isListen && !isRead && searchParams.set('read', `${story.id}`);
    searchParams.set('edit', `${story.id}`);
    navigate(`?${searchParams.toString()}`, { replace: false });
  };

  const onConfirmDelete = () => {
    resetReadStory();
    setRemove(false);
    deleteStory(story.id);
    fetchDeleteStory(story.id);
    searchParams.delete('read');
    searchParams.delete('open-story');
    searchParams.delete('edit');
    navigate(`?${searchParams.toString()}`, { replace: false });
  };

  return (
    <>
      <div className="more-button__inner">
        <button
          type="button"
          className={`more-button${open ? ' open' : ''}${modal ?
            ' bg' : ''}`}
          onClick={toggleStoryActions}
        >
          <More />
        </button>
        <StoryActions
          open={open}
          anchorEl={anchorEl}
          onToggle={toggleStoryActions}
          onEdit={onEdit}
          onShare={setShare}
          onRemove={setRemove}
          onClosePopup={onClosePopup}
        />
      </div>
      <Modal
        open={remove}
        onClose={() => setRemove(false)}
      >
        <DeleteStory
          ref={deleteRef}
          onClose={setRemove}
          onSubmit={onConfirmDelete}
        />
      </Modal>
      <Modal
        open={share}
        onClose={() => setShare(false)}
      >
        <ShareStory ref={shareRef} storyId={story.id} isModal />
      </Modal>
    </>
  );
}

export default MoreButton;
