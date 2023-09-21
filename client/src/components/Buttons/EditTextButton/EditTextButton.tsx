import React from 'react';
import {
  ReactComponent as EditIcon,
} from '../../../images/icons/editing/edit_text-icon.svg';
import './EditTextButton.scss';

interface IEditTextButton {
  setEditing: () => void;
  className?: string;
}

function EditTextButton({ setEditing, className }: IEditTextButton) {
  return (
    <button
      className={`edit-text-button ${className}`}
      onClick={setEditing}
    >
      <span><EditIcon /></span>
      Edit Text
    </button>
  );
}

export default EditTextButton;
