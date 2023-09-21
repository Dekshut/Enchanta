import { EastRounded, WestRounded } from '@mui/icons-material';
import { LinearProgress, Modal } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CardContent from './CardContent';
import CustomContent from './CustomContent';
import NewStoryStep from './NewStoryStep';
import { steps } from '../../../animations';
import {
  storySteps,
  initCard,
  initAgeGroup,
  initStoryType,
  initCharacterDetails,
  storyIngredientsOrder,
  defaultImage,
} from '../../../constants';
import {
  getImage,
  handleClickScroll,
  setUserCards,
  setUserCastomCards,
} from '../../../helpers';
import mixing from '../../../images/content/other/mixing.png';
import {
  ReactComponent as Record,
} from '../../../images/icons/listening/record_black.svg';
import {
  ReactComponent as Generate,
} from '../../../images/icons/other/generate-icon.svg';
import {
  ReactComponent as Book,
} from '../../../images/icons/reading/read-icon.svg';
import { useStoryStore, useSubscriptionStore } from '../../../store';
import { PrimaryButton, SecondaryButton } from '../../Buttons';
import { ModalHeader, ModalWrapper } from '../../ModalConstructor';
import { ConfirmRecord } from '../../Modals';
import Spinner from '../../Spinner';
import './NewStory.scss';

function NewStory() {
  const [step, setStep] = useState<Steps>('0');
  const [stepsWay, setStepWay] = useState<Steps[]>(['0']);

  const [selectedAge, setSelectedAge] = useState<CardAgeInfo>(initAgeGroup);
  const [storyTypes, setStoryTypes] = useState<CardStoryTypeInfo[]>([]);
  const [selectedStoryType, setSelectedStoryType] =
    useState<CardStoryTypeInfo>(initStoryType);
  const [selectedMainCharacter, setSelectedMainCharacter] =
    useState<CardInfo>(initCard);
  const [selectedCharacterDetails, setSelectedCharacterDetails] =
    useState<CardCharacterDetailsInfo>(initCharacterDetails);
  const [customCharacterDetails, setCustomCharacterDetails] =
    useState<string>('');
  const [selectedStoryTheme, setSelectedStoryTheme] =
    useState<CardInfo>(initCard);
  const [selectedIllustration, setSelectedIllustration] =
    useState<CardInfo>(initCard);
  const [allUserData, setAllUserData] = useState<Cards[]>([]);

  const [recordModal, setRecordModal] = useState<boolean>(false);

  const {
    readStory,
    errorCreate,
    generatedStoryId,
    generateStory,
    checkNewStory,
    resetReadStory,
    resetErrorCreate,
    resetGeneratedStoryId,
  } = useStoryStore((state: IStoryStore & IStoryActions) => state);
  const {
    getUserCredits,
  } = useSubscriptionStore((store: ISubscriptionActions) => store);

  const [searchParams] = useSearchParams() || '';
  const navigate = useNavigate();
  const recordRef = useRef<HTMLDivElement>(null);

  const onClose = () => {
    searchParams.delete('story-creator');
    searchParams.delete('step');
    navigate(`?${searchParams.toString()}`, { replace: true });
    resetGeneratedStoryId();
    resetReadStory();
  };

  const onGenerate = () => {
    setStep('6');
    setStepWay(['6']);
    searchParams.set('step', '6');
    navigate(`?${searchParams.toString()}`, { replace: false });
    let characterName = allUserData
      .find((category: Cards) => category.nextstep === '3')?.value;
    if (characterName &&
      characterName === 'Enchanta\'s choice') characterName = '';

    const newStory: CreateStoryData = {
      age: selectedAge.value as AgeGroup,
      story_type: selectedStoryType.value as StoryType,
      style: selectedIllustration.value as StoryIllustration,
      main_character: allUserData
        .find((category: Cards) =>
          category.type === 'Main character')?.value as StoryMainCharacter,
      character_name: characterName,
      story_theme: allUserData
        .find((category: Cards) =>
          category.type === 'Theme')?.value as StoryTheme,
    };
    generateStory(newStory).then(getUserCredits);
  };

  const onReadStory = () => {
    searchParams.delete('story-creator');
    searchParams.delete('step');
    searchParams.set('open-story', `${readStory.id}`);
    searchParams.set('read', `${readStory.id}`);
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const onCreateAudioToStory = () => {
    searchParams.delete('story-creator');
    searchParams.delete('step');
    searchParams.set('open-story', `${readStory.id}`);
    searchParams.set('record', `${readStory.id}`);
    searchParams.set('instruction', 'on');
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  const onContinue = () => {
    const currentStep = searchParams.get('step') as Steps;
    const stepIdx = stepsWay.indexOf(currentStep);

    if (stepsWay.includes(currentStep) &&
      (stepIdx < (stepsWay.length - 1))) {
      if (stepsWay.includes('5')) {
        setStep('5');
        searchParams.set('step', '5');
        navigate(`?${searchParams.toString()}`, { replace: false });
      } else {
        const newStep = stepsWay[stepIdx + 1];
        setStep(newStep);
        searchParams.set('step', newStep);
        navigate(`?${searchParams.toString()}`, { replace: false });
      }
    } else {
      setStepWay([...stepsWay, currentStep]);
      setStep(currentStep);
      navigate(`?${searchParams.toString()}`, { replace: false });
    }
  };

  const onContinueAge = (selectedAge: CardAgeInfo) => {
    resetReadStory();
    const currentStep = searchParams.get('step') as Steps;
    const stepIdx = stepsWay.indexOf(currentStep);
    const newStoryTypes = storySteps['1'].variants
      .filter((variant: CardStoryTypeInfo) =>
        variant.location?.includes(selectedAge.key));
    if (stepsWay.length === 1) {
      setStoryTypes(newStoryTypes);
      setStepWay([...stepsWay, '1']);
      setStep('1');
      searchParams.set('step', '1');
      navigate(`?${searchParams.toString()}`, { replace: false });
    } else {
      if (stepsWay.includes('5') || stepsWay.includes('1')) {
        if (!newStoryTypes.find((type: CardStoryTypeInfo) =>
          type.desc === selectedAge.desc)) {
          setStoryTypes(newStoryTypes);
          setStep(selectedAge.nextstep);
          searchParams.set('step', selectedAge.nextstep);
          navigate(`?${searchParams.toString()}`, { replace: false });
        } else {
          setStep('5');
          searchParams.set('step', '5');
          navigate(`?${searchParams.toString()}`, { replace: false });
        }
      } else {
        const newStep = stepsWay[stepIdx + 1];
        setStep(newStep);
        searchParams.set('step', newStep);
        navigate(`?${searchParams.toString()}`, { replace: false });
      }
    }
  };

  const onContinueStoryType = () => {
    const currentStep = searchParams.get('step') as Steps;
    const stepIdx = stepsWay.indexOf(currentStep);

    if (stepsWay.includes(currentStep) && (stepIdx < (stepsWay.length - 1))) {
      if (stepsWay.includes('5')) {
        if (selectedStoryType.nextstep === stepsWay[2]) {
          setStep('5');
          searchParams.set('step', '5');
          navigate(`?${searchParams.toString()}`, { replace: false });
        } else {
          setSelectedMainCharacter(initCard);
          setSelectedCharacterDetails(initCharacterDetails);
          setCustomCharacterDetails('');
          setSelectedStoryTheme(initCard);
          setStepWay(['0', '1', selectedStoryType.nextstep]);
          setAllUserData([
            selectedAge, selectedStoryType,
          ]);
          setStep(selectedStoryType.nextstep);
          searchParams.set('step', selectedStoryType.nextstep);
          navigate(`?${searchParams.toString()}`, { replace: false });
        }
      } else {
        const newStep = stepsWay[stepIdx + 1];
        setStep(newStep);
        searchParams.set('step', newStep);
        navigate(`?${searchParams.toString()}`, { replace: false });
      }
    } else {
      if (stepsWay.includes('5')) {
        setStepWay(['0', '1', currentStep]);
        setAllUserData([selectedAge, selectedStoryType]);
        setStep(currentStep);
        navigate(`?${searchParams.toString()}`, { replace: false });
      } else {
        setStepWay([...stepsWay, currentStep]);
        setStep(currentStep);
        navigate(`?${searchParams.toString()}`, { replace: false });
      }
    }
  };

  const onContinueIllustration = () => {
    const currentStep = searchParams.get('step') as Steps;
    const stepIdx = stepsWay.indexOf(currentStep);
    if (stepsWay.includes(currentStep) &&
      (stepIdx < (stepsWay.length - 1))) {
      if (stepsWay.includes('5')) {
        setStep('5');
        searchParams.set('step', '5');
        navigate(`?${searchParams.toString()}`, { replace: false });
      } else {
        const newStep = stepsWay[stepIdx + 1];
        setStep(newStep);
        searchParams.set('step', newStep);
        navigate(`?${searchParams.toString()}`, { replace: false });
      }
    } else {
      if (!stepsWay.includes('5')) {
        setStepWay([...stepsWay, '5']);
        if (!allUserData.find((data: Cards) =>
          data.type === 'Illustration style')) {
          setAllUserData([...allUserData, selectedIllustration]);
        }
        setStep('5');
        navigate(`?${searchParams.toString()}`, { replace: false });
      } else {
        setStepWay([...stepsWay, currentStep]);
        setStep(currentStep);
        navigate(`?${searchParams.toString()}`, { replace: false });
      }
    }
  };

  const onContinueMainCharacter = () => {
    if (stepsWay.includes('5')) {
      if (step === '2' && stepsWay.includes(selectedMainCharacter.nextstep)) {
        setStep('5');
        searchParams.set('step', '5');
        navigate(`?${searchParams.toString()}`, { replace: false });
      } else {
        const indexOfPrevStep = stepsWay
          .indexOf(selectedMainCharacter.nextstep === '2.1' ? '2.2' : '2.1');
        const newStepsWay = [
          ...stepsWay.slice(0, indexOfPrevStep),
          selectedMainCharacter.nextstep,
          ...stepsWay.slice(indexOfPrevStep + 1),
        ];
        setStepWay(newStepsWay);
        setCustomCharacterDetails('');
        setSelectedCharacterDetails(initCharacterDetails);
        setStep(selectedMainCharacter.nextstep);
        searchParams.set('step', selectedMainCharacter.nextstep);
        navigate(`?${searchParams.toString()}`, { replace: false });
      }
    } else {
      setStepWay([...stepsWay, selectedMainCharacter.nextstep]);
      setStep(selectedMainCharacter.nextstep);
      searchParams.set('step', selectedMainCharacter.nextstep);
      navigate(`?${searchParams.toString()}`, { replace: false });
    }
  };

  const onDisabledContinue = (step: Steps) => {
    switch (step) {
    case '1':
      return selectedStoryType === initStoryType ? true : false;
    case '2':
      return selectedMainCharacter === initCard ? true : false;
    case '2.1':
      return selectedCharacterDetails === initCharacterDetails ? true : false;
    case '2.2':
      return selectedCharacterDetails === initCharacterDetails ? true : false;
    case '3':
      return selectedStoryTheme === initCard ? true : false;
    case '4':
      return selectedIllustration === initCard ? true : false;
    default:
      return false;
    }
  };

  useEffect(() => {
    searchParams.set('step', '0');
    navigate(`?${searchParams.toString()}`, { replace: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step === '6' && readStory.id && readStory.id !== 0) {
      getUserCredits();
      setStep('7');
      setStepWay(['7']);
      searchParams.set('step', '7');
      navigate(`?${searchParams.toString()}`, { replace: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, readStory.id]);

  useEffect(() => {
    if (step === '6' && errorCreate) {
      resetErrorCreate();
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorCreate]);

  useEffect(() => {
    if (step === '6' && generatedStoryId && readStory.id === 0) {
      checkNewStory(generatedStoryId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedStoryId, readStory.id]);

  useEffect(() => {
    if (selectedAge.nextstep === '1') {
      searchParams.set('step', selectedAge.nextstep);
      setAllUserData(setUserCards(selectedAge, allUserData));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAge]);

  useEffect(() => {
    if (selectedStoryType && selectedStoryType.desc.length) {
      searchParams.set('step', selectedStoryType.nextstep);
      setAllUserData(setUserCards(selectedStoryType, allUserData));
      handleClickScroll('new-story-navigate');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStoryType]);

  useEffect(() => {
    if (selectedMainCharacter && selectedMainCharacter.desc.length) {
      searchParams.set('step', selectedMainCharacter.nextstep);
      setAllUserData(setUserCards(selectedMainCharacter, allUserData));
      handleClickScroll('new-story-navigate');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMainCharacter]);

  useEffect(() => {
    if (selectedCharacterDetails && selectedCharacterDetails.desc.length) {
      searchParams.set('step', selectedCharacterDetails.nextstep);
      setAllUserData(
        setUserCastomCards(
          selectedCharacterDetails, allUserData, customCharacterDetails,
        ));
      handleClickScroll('new-story-navigate');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCharacterDetails, customCharacterDetails]);

  useEffect(() => {
    if (selectedStoryTheme && selectedStoryTheme.desc.length) {
      searchParams.set('step', selectedStoryTheme.nextstep);
      setAllUserData(setUserCards(selectedStoryTheme, allUserData));
      handleClickScroll('new-story-navigate');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStoryTheme]);

  useEffect(() => {
    if (selectedIllustration && selectedIllustration.desc.length) {
      searchParams.set('step', selectedIllustration.nextstep);
      setAllUserData(setUserCards(selectedIllustration, allUserData));
      handleClickScroll('new-story-navigate');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIllustration]);

  const content = {
    '0': <CardContent<CardAgeInfo>
      cards={storySteps[0].variants}
      setSelectedCard={setSelectedAge}
      selectedVariant={selectedAge}
      onContinueAge={onContinueAge}
    />,
    '1': <CardContent<CardStoryTypeInfo>
      cards={storyTypes}
      setSelectedCard={setSelectedStoryType}
      selectedVariant={selectedStoryType}
    />,
    '2': <CardContent
      cards={storySteps[2].variants}
      setSelectedCard={setSelectedMainCharacter}
      selectedVariant={selectedMainCharacter}
    />,
    '2.1': <CustomContent
      variants={storySteps[2.1].variants}
      setSelectedVariant={setSelectedCharacterDetails}
      value={customCharacterDetails}
      setValue={setCustomCharacterDetails}
      selectedVariant={selectedCharacterDetails}
    />,
    '2.2': <CustomContent
      variants={storySteps[2.2].variants}
      setSelectedVariant={setSelectedCharacterDetails}
      value={customCharacterDetails}
      setValue={setCustomCharacterDetails}
      selectedVariant={selectedCharacterDetails}
    />,
    '3': <CardContent
      cards={storySteps[3].variants}
      setSelectedCard={setSelectedStoryTheme}
      selectedVariant={selectedStoryTheme}
    />,
    '4': <CardContent
      cards={storySteps[4].variants}
      setSelectedCard={setSelectedIllustration}
      selectedVariant={selectedIllustration}
    />,
    '5': <CardContent
      all
      cards={allUserData.sort((a: Cards, b: Cards) =>
        storyIngredientsOrder.indexOf(a.type) -
        storyIngredientsOrder.indexOf(b.type))}
      setStep={setStep}
    />,
    '6': <div className="new-story__load">
      {getImage(mixing || defaultImage, 'await',
        '180', '180', 'new-story__load-image')}
      <Spinner />
    </div>,
    '7': <div className="new-story__success">
      <div className="new-story__success-content">
        {getImage(
          readStory?.cover || defaultImage,
          readStory?.title || '',
          '200', '200',
          'new-story__success-image',
        )}
        <h3 className="new-story__success-title">
          {readStory?.title}
        </h3>
      </div>
      <div className="new-story__success-buttons">
        <PrimaryButton
          iconPosition="left"
          icon={<Book />}
          text="Read Storybook"
          onClick={onReadStory}
        />
        <SecondaryButton
          iconPosition="left"
          icon={<Record />}
          text="Record Audiostory"
          onClick={() => setRecordModal(true)}
        />
      </div>
    </div>,
  };

  const pageWithoutNavigation = (step === '0' || step === '6' || step === '7');

  return (
    <>
      <ModalWrapper>
        <div className={`new-story${pageWithoutNavigation ? ' all' : ''}`}>
          <ModalHeader
            title="New Story"
            onClose={onClose}
          />
          <div className="new-story__content">
            <AnimatePresence mode="wait" initial={false}>
              {step &&
                <motion.div
                  key={step}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={steps}
                >
                  <NewStoryStep
                    question={storySteps[step].title}
                    description={(
                      step === '5' || step === '6' || step === '7') ?
                      storySteps[step].desc :
                      undefined}
                    content={content[step]}
                  />
                </motion.div>}
            </AnimatePresence>
          </div>
          {step !== '0' && step !== '5' && step !== '6' && step !== '7' &&
            <div
              className="new-story__navigate"
              id="new-story-navigate"
            >
              <SecondaryButton
                thin
                text="Go Back"
                iconPosition="left"
                icon={<WestRounded />}
                onClick={() => {
                  navigate(-1);
                  const selectedStep = stepsWay.indexOf(step);
                  setStep(stepsWay[selectedStep - 1]);
                }}
              />
              <LinearProgress
                variant="determinate"
                value={+step * 20}
              />
              <PrimaryButton
                thin
                text="Continue"
                iconPosition="right"
                icon={<EastRounded />}
                onClick={step === '1' ?
                  onContinueStoryType : (step === '4' ?
                    onContinueIllustration : (step === '2' ?
                      onContinueMainCharacter :
                      onContinue))}
                disabled={onDisabledContinue(step)}
              />
            </div>}
          {step === '5' &&
            <div className="new-story__generate new-story__navigate">
              <PrimaryButton
                text="Generate Story"
                iconPosition="left"
                icon={<Generate />}
                onClick={onGenerate}
              />
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

export default NewStory;
