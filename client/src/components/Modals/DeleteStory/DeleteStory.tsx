import React, {
  Dispatch, ForwardedRef, forwardRef, SetStateAction,
} from 'react';
import { defaultImage } from '../../../constants';
import { getImage } from '../../../helpers';
import deleteImg from '../../../images/content/other/deleting.png';
import { PrimaryButton, SecondaryButton } from '../../Buttons';
import './DeleteStory.scss';

interface DeleteStoryProps {
  // ref?: MutableRefObject<HTMLDivElement | null>;
  onSubmit: () => void;
  onClose: Dispatch<SetStateAction<boolean>>;
}

const DeleteStory = forwardRef(
  (
    { onClose, onSubmit }: DeleteStoryProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {

    return (
      <div className="delete-story" ref={ref} tabIndex={-1}>
        {getImage(
          deleteImg || defaultImage, 'delete',
          '120', '120', 'delete-story__image')}
        <div className="delete-story__content">
          <h1 className="delete-story__title title">
            Are you sure you want to delete this story from your account?
          </h1>
          <p className="delete-story__desc">
            This action will permanently delete the story
            and all associated data, including shared links.
            This cannot be undone.
          </p>
        </div>
        <div className="delete-story__buttons">
          <SecondaryButton
            thin
            iconPosition="none"
            text="No, Cancel"
            onClick={() => onClose(false)}
          />
          <PrimaryButton
            background="red"
            thin
            iconPosition="none"
            text="Yes, Delete"
            onClick={() => {
              onSubmit();
              onClose(false);
            }}
          />
        </div>
      </div>
    );
  });

export default DeleteStory;
