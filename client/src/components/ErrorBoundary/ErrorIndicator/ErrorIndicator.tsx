import React from 'react';
import { errorIndicator } from '../../../constants';
import { getImage } from '../../../helpers';
import './ErrorIndicator.scss';

function ErrorIndicator() {

  return (
    <div className="error-indicator" data-testid="error-indicator">
      {getImage(
        errorIndicator, 'sad-pineapple',
        '445', '346', 'error-indicator__image')}
      <div className="error-indicator__inner">
        <h2 className="error-indicator__title title">
          Oops!
        </h2>
        <p className="error-indicator__text subtitle">
          Something went wrong here
        </p>
      </div>
    </div>
  );
}

export default ErrorIndicator;
