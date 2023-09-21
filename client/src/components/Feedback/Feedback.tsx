import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { getImage } from '../../helpers';
import Rate0 from '../../images/emoji/face-with-thermometer.png';
import Rate1 from '../../images/emoji/pensive-face.png';
import Rate4 from '../../images/emoji/smiling-face-with-heart-eyes.png';
import Rate3 from '../../images/emoji/smiling-face-with-sunglasses.png';
import Rate2 from '../../images/emoji/smiling-face.png';
import { useStoryStore } from '../../store';
import { SecondaryButton } from '../Buttons';
import './Feedback.scss';

const rating = [
  { rate: 0, src: Rate0 },
  { rate: 1, src: Rate1 },
  { rate: 2, src: Rate2 },
  { rate: 3, src: Rate3 },
  { rate: 4, src: Rate4 },
];

function Feedback({ storyId }: { storyId: string | number }) {
  const [rate, setRate] = useState<number | null>(null);
  const [text, setText] = useState<string>('');
  const [sent, setSent] = useState<boolean>(false);

  const { fetchFeedback } = useStoryStore((state: IStoryActions) => state);

  const onSubmit = () => {
    setSent(true);
    fetchFeedback({ storyId: +storyId, rate: rate || 0, text }).catch();
  };

  return (
    <div className="feedback">
      {sent ?
        <h1 className="feedback__thanks">Thanks for Your feedback!</h1> :
        <>
          <h3 className="feedback__title">
            Your feedback helps us grow.
            <br />Please rate your story.
          </h3>
          <ul className="feedback__rating">
            {rating.map((item) => {
              const className = rate === item.rate ? ' active' : '';
              return (
                <li key={item.rate}>
                  <button
                    className={'feedback__emoji' + className}
                    onClick={() => setRate(item.rate)}
                  >
                    {getImage(item.src, item.rate + 1 + '', '100%', '100%')}
                  </button>
                </li>
              );
            })}
          </ul>
          <AnimatePresence>
            {rate &&
              <>
                <motion.textarea
                  initial={{ opacity: 0, scale: 0.2 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="feedback__text"
                  value={text}
                  placeholder="Leave your feedback here…"
                  onChange={(e) => setText(e.target.value)} />
                <SecondaryButton
                  type="submit"
                  onClick={onSubmit}
                  disabled={rate === null || !text.length}
                  iconPosition="none"
                  text="Send Feedback"
                />
              </>}
          </AnimatePresence>
        </>}
    </div>
  );
}

export default Feedback;
