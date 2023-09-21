import React, {
  Dispatch, ForwardedRef, forwardRef, SetStateAction,
} from 'react';
import { defaultImage } from '../../../constants';
import { getImage } from '../../../helpers';
import recordImg from '../../../images/content/other/audiostories.png';
import { PrimaryButton, SecondaryButton } from '../../Buttons';
import './ConfirmRecord.scss';

interface ConfirmRecordProps {
  onSubmit: () => void;
  onClose: Dispatch<SetStateAction<boolean>>;
}

const ConfirmRecord = forwardRef((
  { onClose, onSubmit }: ConfirmRecordProps,
  ref: ForwardedRef<HTMLDivElement>,
) => {

  return (
    <div className="confirm-record" ref={ref} tabIndex={-1}>
      {getImage(
        recordImg || defaultImage, 'confirm-record',
        '120', '120', 'confirm-record__image')}
      <div className="confirm-record__content">
        <h1 className="confirm-record__title title">
          No audio version available.
          Would you like to create one?
        </h1>
        <p className="confirm-record__desc">
          Learn how to create your own audio version of the story with our
          easy-to-follow instructions on the next screen.
        </p>
      </div>
      <div className="confirm-record__buttons">
        <SecondaryButton
          thin
          iconPosition="none"
          text="Go Back"
          onClick={() => onClose(false)}
          width="112px"
        />
        <PrimaryButton
          thin
          iconPosition="none"
          text="Continue"
          onClick={() => {
            onSubmit();
            onClose(false);
          }}
          width="118px"
        />
      </div>
    </div>
  );
});

export default ConfirmRecord;
