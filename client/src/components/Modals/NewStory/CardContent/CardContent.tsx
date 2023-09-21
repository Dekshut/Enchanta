import React, { Dispatch, SetStateAction } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { defaultImage } from '../../../../constants';
import {
  getImage,
  isCardAgeInfoType,
  isCardCharacterDetailsInfoType,
} from '../../../../helpers';
import baby from '../../../../images/content/age/0_to_2_years_old.png';
import preschool from '../../../../images/content/age/3_to_5_years_old.png';
import school from '../../../../images/content/age/6_to_8_years_old.png';
import animal from '../../../../images/content/character/animal.png';
import boy from '../../../../images/content/character/boy.png';
import fantasticalCreature
  from '../../../../images/content/character/fantastical_creature.png';
import girl from '../../../../images/content/character/girl.png';
import man from '../../../../images/content/character/man.png';
import woman from '../../../../images/content/character/woman.png';
import comicBook from '../../../../images/content/illustration/comic_book.png';
import handDrawn from '../../../../images/content/illustration/hand_drawn.png';
import ink from '../../../../images/content/illustration/ink.png';
import linocut from '../../../../images/content/illustration/linocut.png';
import popArt from '../../../../images/content/illustration/pop_art.png';
import watercolor from '../../../../images/content/illustration/watercolor.png';
import custom from '../../../../images/content/other/custom_name.png';
import courage from '../../../../images/content/theme/courage.png';
import emotions from '../../../../images/content/theme/emotions.png';
import family from '../../../../images/content/theme/family.png';
import friendship from '../../../../images/content/theme/friendship.png';
import perseverence
  from '../../../../images/content/theme/perseverence.png';
import responsability
  from '../../../../images/content/theme/responsability.png';
import bedtimeStory
  from '../../../../images/content/type/bedtime_story.png';
import counting from '../../../../images/content/type/counting_story.png';
import fairyTale from '../../../../images/content/type/fairy_tale.png';
import nurseryRhyme
  from '../../../../images/content/type/nursery_rhyme.png';
import poetry from '../../../../images/content/type/poetry.png';
import './CardContent.scss';

const ageImg: string[] = [baby, preschool, school];
const storyTypeImg: string[] = [
  counting, nurseryRhyme, bedtimeStory, fairyTale, poetry,
];
const characterImg: string[] = [
  boy, girl, man, woman, animal, fantasticalCreature,
];
const themeImg: string[] = [
  friendship, family, emotions, courage, responsability, perseverence,
];
const illustrationImg: string[] = [
  handDrawn, comicBook, watercolor, ink, linocut, popArt,
];

type CardContentSimpleProps<S> = {
  cards: S[];
  selectedVariant: S;
  setSelectedCard: Dispatch<SetStateAction<S>>;
  onContinueAge?: (card: S) => void;
  all?: never;
  setStep?: never;
};
type CardContentAllProps<S> = {
  cards: S[];
  all: boolean;
  setStep: Dispatch<SetStateAction<Steps>>;
  setSelectedCard?: never;
  selectedVariant?: never;
  onContinueAge?: never;
};

type CardContentProps<S> = CardContentSimpleProps<S> | CardContentAllProps<S>;

function CardContent<S extends CardInfo = CardInfo>({
  cards,
  setSelectedCard,
  setStep,
  all,
  selectedVariant,
  onContinueAge,
}: CardContentProps<S>) {
  const [searchParams] = useSearchParams() || '';
  const navigate = useNavigate();

  const onClick = (card: S) => all ?
    [setStep(card.step),
      searchParams.set('step', card.step),
      navigate(`?${searchParams.toString()}`, { replace: true }),
    ] :
    setSelectedCard && setSelectedCard(card);

  const getImageGroup = (card: S, index: number, all?: boolean) => {
    if(all && index === 3) {
      return custom;
    }
    switch (card.type) {
    case 'Age group':
      return ageImg[card.indexImg];
    case 'Illustration style':
      return illustrationImg[card.indexImg];
    case 'Story type':
      return storyTypeImg[card.indexImg];
    case 'Main character':
      return characterImg[card.indexImg];
    case 'Theme':
      return themeImg[card.indexImg];
    default:
      return defaultImage;
    }
  };

  return (
    <ul className="card__list">
      {cards.map((card: S, index: number) => (
        <li key={index} className={`card__item${all ? ' all' : ' main'}`}>
          {getImage(
            getImageGroup(card, index, all),
            card.alt, '100%', '100%', 'card-cover',
          )}
          <button
            className={`card__button${((selectedVariant?.desc !== card.desc) &&
              (selectedVariant?.desc !== '')) && !all ?
              ' no-selected' : ''}`}
            type="button"
            onClick={() => {
              onClick(card);
              isCardAgeInfoType(card) && onContinueAge && onContinueAge(card);
            }}
          >
            {all &&
              <h3 className="card__title">{card.type}</h3>}

            <p className="card__description">
              {(all &&
                (index === 3) &&
                isCardCharacterDetailsInfoType(card)) ?
                card.value : card.desc}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}

export default CardContent;
