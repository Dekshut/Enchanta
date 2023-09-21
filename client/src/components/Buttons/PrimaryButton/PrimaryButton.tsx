import React from 'react';
import Spinner from '../../Spinner';
import './PrimaryButton.scss';

interface PrimaryButtonProps {
  background?: string;
  text: string;
  iconPosition: 'left' | 'right' | 'both' | 'none';
  icon?: JSX.Element;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
  onClick?: () => void;
  type?: 'submit' | 'reset' | 'button';
  disabled?: boolean;
  thin?: boolean;
  width?: string;
  colorReverse?: boolean;
  loader?: boolean;
}

function PrimaryButton({
  background = '',
  type = 'button',
  text,
  iconPosition,
  icon,
  iconLeft,
  iconRight,
  onClick,
  disabled,
  width = 'fit-content',
  thin,
  colorReverse,
  loader,
}: PrimaryButtonProps) {

  return (
    <button
      className={`primary-button${colorReverse ?
        ' white' : ''}${thin ? ' thin' : ''}${background ?
        ` ${background}` : ''}`}
      type={type}
      onClick={onClick}
      style={{ width }}
      disabled={disabled}
    >
      {iconPosition === 'left' || iconPosition === 'both' ?
        icon || iconLeft : null}
      {loader ?
        <Spinner white /> :
        <span className="primary-button__text">
          {text}
        </span>}
      {iconPosition === 'right' || iconPosition === 'both' ?
        icon || iconRight : null}
    </button>
  );
}

export default PrimaryButton;
