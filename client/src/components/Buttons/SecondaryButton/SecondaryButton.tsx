import React from 'react';
import './SecondaryButton.scss';

interface SecondaryButtonProps {
  type?: 'submit' | 'reset' | 'button';
  text: string;
  onClick: () => void;
  iconPosition: 'left' | 'right' | 'both' | 'none';
  icon?: JSX.Element;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  disabled?: boolean;
  thin?: boolean;
  width?: string;
  asContent?: boolean;
}

function SecondaryButton({
  type = 'button',
  text,
  onClick,
  iconPosition,
  icon,
  iconLeft,
  iconRight,
  disabled,
  thin,
  width = 'fit-content',
  asContent,
}: SecondaryButtonProps) {

  return (
    <>{
      asContent ?
        <div
          className={`secondary-button${thin ? ' thin' : ''}`}
          onClick={onClick}
          style={{ width }}
        >
          {iconPosition === 'left' || iconPosition === 'both' ?
            icon || iconLeft : null}
          <span className="secondary-button__text">
            {text}
          </span>
          {iconPosition === 'right' || iconPosition === 'both' ?
            icon || iconRight : null}
        </div> :
        <button
          className={`secondary-button${thin ? ' thin' : ''}`}
          type={type}
          onClick={onClick}
          style={{ width }}
          disabled={disabled}
        >
          {iconPosition === 'left' || iconPosition === 'both' ?
            icon || iconLeft : null}
          <span className="secondary-button__text">
            {text}
          </span>
          {iconPosition === 'right' || iconPosition === 'both' ?
            icon || iconRight : null}
        </button>
    }</>
  );
}

export default SecondaryButton;
