import React from 'react';
import './OverlayButton.scss';

interface OverlayButtonProps {
  text: string;
  icon?: JSX.Element;
  mode?: string;
  disabled?: boolean;
  children?: JSX.Element;
  onClick: () => void;
  hasBackground?: boolean;
}

function OverlayButton({
  text,
  icon,
  mode,
  disabled,
  onClick,
  children,
  hasBackground,
}: OverlayButtonProps) {

  return (
    <button
      className={`overlay-button${mode === 'edit' ?
        ' editing' : ''}${hasBackground ?
        ' hasBackground' : ''}`}
      disabled={disabled}
      onClick={onClick}
    >
      {mode !== 'edit' &&
        <span className="overlay-button__icon">{icon}</span>}
      <span className="overlay-button__text">{text}</span>
      {children}
    </button>
  );
}

export default OverlayButton;
