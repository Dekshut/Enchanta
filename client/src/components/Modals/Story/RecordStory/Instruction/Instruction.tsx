import React from 'react';
import { defaultImage, instructions } from '../../../../../constants';
import { getImage } from '../../../../../helpers';
import quietRecording
  from '../../../../../images/content/instruction/quiet_recording.png';
import reviewAudio
  from '../../../../../images/content/instruction/review_audio.png';
import speakClearly
  from '../../../../../images/content/instruction/speak_clearly.png';
import './Instruction.scss';

const instructionImage = [speakClearly, quietRecording, reviewAudio];

function Instruction() {
  return (
    <div className="instruction">
      <div className="instruction__inner">
        <div className="instruction__header">
          <h3 className="instruction__title title">
            Recording Instructions
          </h3>
          <p className="instruction__description subtitle">
            Follow the instructions below for the best recording result
          </p>
        </div>
        <ul className="instruction__list">
          {instructions.map((instruction: string, index: number) => (
            <li key={index} className="instruction__item">
              {getImage(
                instructionImage[index] || defaultImage,
                `instruction-${index + 1}`,
                '100%', '100%', 'instruction__item-image',
              )}
              <p className="instruction__item-text">
                {instruction}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Instruction;
