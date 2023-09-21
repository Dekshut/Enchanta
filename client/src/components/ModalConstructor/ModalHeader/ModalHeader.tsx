import { Close } from '@mui/icons-material';
import React, { memo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { initStory } from '../../../constants';
import { ReactComponent as Logo } from '../../../images/enchanta-logo.svg';
import { useRecordStore, useStoryStore } from '../../../store';
import { MoreButton } from '../../Buttons';
import StoryTitle from '../../StoryTitle';
import './ModalHeader.scss';

type ModalHeaderStory = {
  title?: string;
  isRead?: string;
  isEdit?: string;
  isListen?: string;
  isRecord?: string;
  story: UserStory;
  onClose: () => void;
};

type ModalHeaderSimple = {
  onClose: () => void;
  title?: string;
  isRead?: never;
  isEdit?: never;
  story?: never;
  isListen?: never;
  isRecord?: never;
};

type ModalHeaderProps = ModalHeaderStory | ModalHeaderSimple;

const ModalHeader = memo(
  ({
    isRead,
    isEdit,
    isListen,
    isRecord,
    title,
    onClose,
    story,
  }: ModalHeaderProps) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams() || '';
    const { resetReadStory } = useStoryStore();
    const { stream, setStream, setPermission, resetRecordStore } =
      useRecordStore();

    const onBackToHome = () => {
      onClose();
      resetReadStory();
      searchParams.delete('subscription-plan');
      searchParams.delete('story-creator');
      searchParams.delete('open-story');
      searchParams.delete('step');
      searchParams.delete('read');
      searchParams.delete('edit');
      searchParams.delete('listen');
      searchParams.delete('record');
      searchParams.delete('instruction');
      searchParams.delete('preparatory');
      searchParams.delete('start');
      searchParams.delete('finish');
      navigate(`?${searchParams.toString()}`, { replace: true });
      setStream(null);
      setPermission(false);
      resetRecordStore();
      if (stream) stream.getTracks()[0].stop();
    };

    return (
      <div className="modal-header">
        <div className="modal-header__container">
          <button
            className="modal-header__button-back"
            onClick={() => onBackToHome()}
            type="button"
          >
            <Logo />
          </button>
          {title && (
            <StoryTitle
              isEdit={!!isEdit}
              isRecord={!!isRecord}
              title={story ? story.title : title}
              story={story ? story : initStory}
            />
          )}
          <div className="modal-header__inner">
            {(isRead || isListen) && <MoreButton story={story} modal />}
            <button
              className="modal-header__button"
              type="button"
              onClick={onClose}
            >
              <Close />
            </button>
          </div>
        </div>
      </div>
    );
  },
);

export default ModalHeader;
