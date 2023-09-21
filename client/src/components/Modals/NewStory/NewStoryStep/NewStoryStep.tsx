import React from 'react';
import './NewStoryStep.scss';

interface NewStoryStepProps {
  question: string;
  description?: string;
  content?: JSX.Element;
}

function NewStoryStep({
  question,
  content,
  description,
}: NewStoryStepProps) {

  return (
    <div className="new-story-step">
      <div className="new-story-step__container">
        <div className="new-story-step__header">
          <h2 className="new-story-step__title title">
            {question}
          </h2>
          <p className="new-story-step__desc subtitle">
            {description}
          </p>
        </div>
        <div className="new-story-step__content">
          {content}
        </div>
      </div>
    </div>
  );
}

export default NewStoryStep;
