import { PauseRounded } from '@mui/icons-material';
import { Modal } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useStopwatch } from 'react-timer-hook';
import EditStory from './EditStory';
import ListenStory from './ListenStory';
import ReadStory from './ReadStory';
import RecordStory from './RecordStory';
import Preparatory from './RecordStory/Preparatory';
import StoryBase from './StoryBase';
import { music } from '../../../constants';
import {
  getImage,
  getTime,
  getWindowDimensions,
} from '../../../helpers';
import { useAudio } from '../../../hooks';
import {
  ReactComponent as Instruction,
} from '../../../images/icons/listening/instructions.svg';
import {
  ReactComponent as Pause,
} from '../../../images/icons/listening/pause_rec.svg';
import {
  ReactComponent as Read,
} from '../../../images/icons/listening/read.svg';
import {
  ReactComponent as Record,
} from '../../../images/icons/listening/record.svg';
import {
  ReactComponent as RecordBlack,
} from '../../../images/icons/listening/record_black.svg';
import {
  ReactComponent as Stop,
} from '../../../images/icons/listening/stop_rec.svg';
import {
  ReactComponent as AmbientMusic,
} from '../../../images/icons/other/ambient_music-icon.svg';
import {
  ReactComponent as Listen,
} from '../../../images/icons/other/listen-icon.svg';
import { useRecordStore, useStoryStore } from '../../../store';
import AudioPlayer from '../../AudioPlayer';
import { OverlayButton, PrimaryButton, SecondaryButton } from '../../Buttons';
import { ModalHeader, ModalWrapper } from '../../ModalConstructor';
import { ConfirmRecord } from '../../Modals';
import ViewSwitch from '../../ViewSwitch';
import './Story.scss';

const mimeType = 'audio/webm';

interface StoryProps {
  story: UserStory;
}

function Story({ story }: StoryProps) {
  const [playing, setPlaying] = useAudio(music);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewStory>('landscape');
  const [keyEdit, setKeyEdit] = useState<string>('dog');
  const [recordModal, setRecordModal] = useState<boolean>(false);
  const [disabledSaveAudio, setDisabledSaveAudio] = useState<boolean>(false);
  const {
    userStories,
    copyStory,
    resetGeneratedStoryId,
    resetReadStory,
    getStoryById,
    editableStory,
    fetchUpdateStory,
    setStory,
    saveAudio,
    newAudio,
    resetNewAudio,
    fetchPlayAmbient
  } = useStoryStore();
  const {
    permission,
    setPermission,
    stream,
    setStream,
    audioChunks,
    setAudioChunks,
    audio,
    setAudio,
    audioBlob,
    setAudioBlob,
    recordStatus,
    setRecordStatus,
    resetRecordStore,
  } = useRecordStore();
  const {
    seconds, minutes, start, pause, reset,
  } = useStopwatch({ autoStart: false });
  const { width } = getWindowDimensions();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams() || '';

  const isStoryId = searchParams.get('open-story') || '';
  const isRead = searchParams.get('read') || '';
  const isEdit = searchParams.get('edit') || '';
  const isRecord = searchParams.get('record') || '';
  const isListen = searchParams.get('listen') || '';
  const isInstruction = searchParams.get('instruction') || '';
  const isPreparatory = searchParams.get('preparatory') || '';
  const isStartRecord = searchParams.get('start') || '';
  const isFinishRecord = searchParams.get('finish') || '';

  const selectedStoryId = isEdit || isRead || isRecord || isListen || isStoryId;
  const [selectedStory] = useState<UserStory>(userStories
    .find((story: UserStory) => story.id === +selectedStoryId) || story);

  const recordRef = useRef<HTMLDivElement>(null);
  const mediaRecorder = useRef<MediaRecorder>(null);

  useEffect(() => {
    setDisabledSaveAudio(false);
  }, [isEdit, isRecord, isListen]);

  useEffect(() => {
    isEdit && copyStory(selectedStory.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  useEffect(() => {
    if (selectedStory) {
      getStoryById(isStoryId);
      resetNewAudio();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStory]);

  useEffect(() => {
    if (permission) {
      const timer = setTimeout(() => onStartRecording(), 4000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission]);

  const onClose = () => {
    searchParams.delete('open-story');
    searchParams.delete('read');
    searchParams.delete('edit');
    searchParams.delete('record');
    searchParams.delete('listen');
    searchParams.delete('instruction');
    searchParams.delete('preparatory');
    searchParams.delete('start');
    searchParams.delete('finish');
    navigate(`?${searchParams.toString()}`, { replace: true });
    resetGeneratedStoryId();
    resetReadStory();
    resetNewAudio();
    setPlaying(false);
    setStream(null);
    setPermission(false);
    resetRecordStore();
    if (stream) stream.getTracks()[0].stop();
  };

  const onListenStory = () => {
    searchParams.delete('read');
    searchParams.delete('edit');
    searchParams.set('listen', `${selectedStory.id}`);
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const onCreateAudioToStory = () => {
    searchParams.delete('read');
    searchParams.delete('edit');
    searchParams.set('record', `${selectedStory.id}`);
    searchParams.set('instruction', 'on');
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const closeEdit = () => {
    searchParams.set('read', `${editableStory.id}`);
    searchParams.delete('edit');
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const getMicrophonePermission = async () => {
    if ('MediaRecorder' in window) {
      try {
        const streamData = await navigator.mediaDevices
          .getUserMedia({ audio: true, video: false });
        setPermission(true);
        setStream(streamData);
        searchParams.set('preparatory', 'on');
        navigate(`?${searchParams.toString()}`, { replace: true });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        alert(err.message);
        setPermission(false);
        setStream(null);
      }
    } else {
      setPermission(false);
      setStream(null);
      alert('The MediaRecorder API is not supported in your browser.');
    }
  };

  const onStartRecording = async () => {
    start();
    setRecordStatus('recording');
    searchParams.delete('preparatory');
    searchParams.set('start', 'on');
    navigate(`?${searchParams.toString()}`, { replace: true });
    const media = new MediaRecorder(
      stream as MediaStream,
      {
        mimeType: MediaRecorder
          .isTypeSupported(mimeType) ? mimeType : 'audio/mp4',
      });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    const localAudioChunks: Blob[] = [];
    mediaRecorder.current.ondataavailable = (event: BlobEvent) => {
      if (typeof event.data === 'undefined') return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const onStopRecording = () => {
    reset();
    setRecordStatus('inactive');
    searchParams.delete('start');
    searchParams.set('finish', 'on');
    navigate(`?${searchParams.toString()}`, { replace: true });
    if (mediaRecorder.current) {
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks, {
          type: MediaRecorder
            .isTypeSupported(mimeType) ? mimeType : 'audio/mp4',
        });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudio(audioUrl);
        setAudioBlob(audioBlob);
        setAudioChunks([]);
      };
      mediaRecorder.current.stop();
      setStream(null);
      setPermission(false);
      if (stream) stream.getTracks()[0].stop();
    }
  };

  const onCancelRecording = () => {
    reset();
    const initBlob = new Blob();
    setAudio(undefined);
    setAudioChunks([]);
    setStream(null);
    setPermission(false);
    setAudioBlob(initBlob);
    setRecordStatus('inactive');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    mediaRecorder.current = null;
    if (stream) stream.getTracks()[0].stop();
    isEdit && searchParams.set('listen', `${selectedStory.id}`);
    searchParams.delete('start');
    searchParams.delete('finish');
    searchParams.delete('record');
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const onPauseRecording = () => {
    pause();
    setRecordStatus('paused');
    if (mediaRecorder.current) {
      mediaRecorder.current.pause();
    }
  };

  const onResumeRecording = () => {
    start();
    setRecordStatus('recording');
    searchParams.delete('pause');
    navigate(`?${searchParams.toString()}`, { replace: true });
    if (mediaRecorder.current) {
      mediaRecorder.current.resume();
    }
  };

  const onSaveAudio = () => {
    setDisabledSaveAudio(true);
    saveAudio({ storyId: selectedStory.id, audio: audioBlob });
    resetRecordStore();
    setTimeout(() => {
      searchParams.delete('record');
      searchParams.delete('finish');
      searchParams.set('listen', `${selectedStory.id}`);
      navigate(`?${searchParams.toString()}`, { replace: true });
    }, 3000);
  };

  return (
    <>
      <ModalWrapper>
        <div className={`story${(!isRead && !isEdit && !isRecord && !isListen) ?
          ' all' : ''}${isRecord ?
          ' record' : ''}${isListen ?
          ' listen' : ''}${isEdit && isListen ?
          ' editListen' : ''}`}>
          <ModalHeader
            story={selectedStory}
            isRead={isRead}
            isEdit={isEdit}
            isListen={isListen}
            isRecord={isRecord}
            title={(isRead || isEdit || isRecord || isListen) ?
              selectedStory.title : undefined}
            onClose={onClose}
          />
          {isPreparatory && <Preparatory />}
          <div className={`story__content${isRead ? ' read' : ''}`}>
            <div className="story__container">
              {isRead && !isEdit ?
                <ReadStory
                  viewMode={viewMode}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                /> :
                isEdit && isRead ?
                  <EditStory
                    viewMode={viewMode}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    keyEdit={keyEdit}
                    setKeyEdit={setKeyEdit}
                  /> :
                  isListen ?
                    <ListenStory isEdit={!!isEdit} story={selectedStory} /> :
                    isRecord ? (
                      isFinishRecord ?
                        <div className="story__finish-record">
                          {getImage(
                            selectedStory.cover, 'cover',
                            '460', '460',
                            'story__finish-record-image')}
                        </div> :
                        <RecordStory />
                    ) :
                      <StoryBase
                        story={selectedStory}
                        hasAudio={selectedStory.hasAudio}
                        onRecord={() => selectedStory.hasAudio ?
                          onListenStory() : setRecordModal(true)}
                      />}
            </div>
          </div>
          {isListen && !isPreparatory && !isEdit && !isRead &&
            <div className="story__footer">
              <div className="record-story__overlay">
                <OverlayButton
                  text="Ambient Music"
                  icon={playing ?
                    <PauseRounded titleAccess="Pause" /> :
                    <AmbientMusic title="Play" />}
                  onClick={() => {
                    !playing && fetchPlayAmbient();
                    setPlaying(!playing);
                  }} />
                <AudioPlayer
                  key={newAudio ? newAudio : selectedStory.audioUrl}
                  audio={newAudio ? newAudio : selectedStory.audioUrl}
                />
                <OverlayButton
                  text="Read Storybook"
                  icon={<Read />}
                  onClick={() => {
                    searchParams.delete('instruction');
                    searchParams.delete('record');
                    searchParams.delete('listen');
                    searchParams.set('read', `${selectedStory.id}`);
                    navigate(`?${searchParams.toString()}`, { replace: true });
                  }} />
              </div>
            </div>
          }
          {isRead && !isEdit && !isPreparatory && !isListen &&
            <div className="story__footer">
              <div className="read-story__overlay">
                <OverlayButton
                  text="Ambient Music"
                  icon={playing ?
                    <PauseRounded titleAccess="Pause" /> :
                    <AmbientMusic title="Play" />}
                  onClick={() => {
                    !playing && fetchPlayAmbient();
                    setPlaying(!playing);
                  }}
                />
                {width > 950 &&
                  <ViewSwitch mode={viewMode} setMode={setViewMode} />}
                <OverlayButton
                  icon={(selectedStory.hasAudio || newAudio) ?
                    <Listen /> : <RecordBlack />}
                  text={(selectedStory.hasAudio || newAudio) ?
                    'Listen to Audiostory' : 'Record Audiostory'}
                  onClick={() => {
                    setPlaying(false);
                    selectedStory.hasAudio || newAudio ?
                      onListenStory() : setRecordModal(true);
                  }}
                />
              </div>
            </div>}
          {isEdit && !isPreparatory && !isListen && isRead &&
            <div className="story__footer">
              <div className="read-story__overlay">
                <SecondaryButton
                  thin
                  text="Cancel Changes"
                  iconPosition="none"
                  onClick={() => {
                    setKeyEdit('default');
                    closeEdit();
                  }} />
                {width > 950 &&
                  <ViewSwitch mode={viewMode} setMode={setViewMode} />}
                <PrimaryButton
                  thin
                  text="Done Editing"
                  iconPosition="none"
                  onClick={() => {
                    setStory(editableStory.id);
                    fetchUpdateStory(editableStory);
                    closeEdit();
                  }} />
              </div>
            </div>}
          {isEdit && !isPreparatory && !isRead && isListen &&
            <div className="story__footer">
              <div className="read-story__overlay">
                <SecondaryButton
                  thin
                  text="Cancel Changes"
                  iconPosition="none"
                  onClick={() => {
                    searchParams.delete('edit');
                    navigate(`?${searchParams.toString()}`, { replace: true });
                  }} />
                <PrimaryButton
                  thin
                  iconPosition="left"
                  icon={<Record />}
                  text="Record New Version"
                  onClick={() => {
                    searchParams.delete('listen');
                    searchParams.set('instruction', 'on');
                    searchParams.set('record', `${selectedStory.id}`);
                    navigate(`?${searchParams.toString()}`, { replace: true });
                  }}
                />
                <PrimaryButton
                  thin
                  text="Done Editing"
                  iconPosition="none"
                  onClick={() => {
                    setStory(editableStory.id);
                    fetchUpdateStory(editableStory);
                    searchParams.delete('edit');
                    navigate(`?${searchParams.toString()}`, { replace: true });
                  }} />
              </div>
            </div>}
          {isRecord && !isPreparatory && !isStartRecord && !isFinishRecord &&
            <div className="story__footer">
              <div className="record-story__overlay">
                <OverlayButton
                  hasBackground={!!isInstruction}
                  text="Instructions"
                  icon={<Instruction />}
                  onClick={() => {
                    isInstruction ?
                      searchParams.delete('instruction') :
                      searchParams.set('instruction', 'on');
                    navigate(`?${searchParams.toString()}`, { replace: true });
                  }} />
                <div className="record-story__overlay-recording">
                  <PrimaryButton
                    text="Start Recording"
                    onClick={() => {
                      searchParams.delete('instruction');
                      navigate(
                        `?${searchParams.toString()}`,
                        { replace: true },
                      );
                      getMicrophonePermission();
                    }}
                    iconPosition="left"
                    icon={<Record />}
                  />
                </div>
                <OverlayButton
                  text="Read Storybook"
                  icon={<Read />}
                  onClick={() => {
                    searchParams.delete('instruction');
                    searchParams.delete('record');
                    searchParams.set('read', `${selectedStory.id}`);
                    navigate(`?${searchParams.toString()}`, { replace: true });
                  }} />
              </div>
            </div>}
          {isRecord && !isPreparatory && isStartRecord &&
            <div className="story__footer">
              <div className="record-story__overlay">
                <SecondaryButton
                  thin
                  text={width <= 500 ? 'Cancel' : 'Cancel Recording'}
                  onClick={onCancelRecording}
                  iconPosition="none"
                />
                <div className="record-story__overlay-recording">
                  {recordStatus === 'paused' ?
                    <div className="record-story__overlay-recording--paused">
                      Paused
                    </div> :
                    <div className="record-story__overlay-recording--start">
                      Recording
                    </div>}
                </div>
                <div
                  className="record-story__overlay-controller"
                  style={{
                    width: recordStatus === 'paused' ?
                      '332px' : '345px',
                  }}
                >
                  {recordStatus === 'paused' ?
                    <PrimaryButton
                      thin
                      text="Resume"
                      iconPosition="left"
                      icon={<Record />}
                      onClick={onResumeRecording}
                    /> :
                    <OverlayButton
                      icon={<Pause />}
                      text="Pause"
                      onClick={onPauseRecording}
                    />}
                  <div className="record-story__overlay-controller-time">
                    {getTime(minutes, seconds)}
                  </div>
                  <OverlayButton
                    text="Stop"
                    onClick={onStopRecording}
                    icon={<Stop />}
                  />
                </div>
              </div>
            </div>}
          {isRecord && !isPreparatory && isFinishRecord &&
            <div className="story__footer">
              <div className="record-story__overlay">
                <SecondaryButton
                  thin
                  text="Discard Recording"
                  onClick={onCancelRecording}
                  iconPosition="none"
                />
                <AudioPlayer audio={audio ?? ''} />
                <PrimaryButton
                  thin
                  width="121px"
                  loader={disabledSaveAudio}
                  text="Save Audio"
                  onClick={onSaveAudio}
                  iconPosition="none"
                />
              </div>
            </div>}
        </div>
      </ModalWrapper>
      <Modal
        open={recordModal}
        onClose={() => setRecordModal(false)}
      >
        <ConfirmRecord
          ref={recordRef}
          onClose={setRecordModal}
          onSubmit={onCreateAudioToStory}
        />
      </Modal>
    </>
  );
}

export default Story;
