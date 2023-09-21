import React, { Dispatch, SetStateAction } from 'react';
import {
  ReactComponent as Landscape
} from '../../images/icons/reading/landscape.svg';
import {
  ReactComponent as Portrait
} from '../../images/icons/reading/portrait.svg';
import './ViewSwitch.scss';

interface IViewSwitch {
  mode: ViewStory;
  setMode: Dispatch<SetStateAction<ViewStory>>;
}

function ViewSwitch({ mode, setMode }: IViewSwitch) {

  return (
    <div className="view-switch">
      <div
        className={`view-mode view-mode--${mode}`}
        onClick={() => setMode(mode === 'portrait' ? 'landscape' : 'portrait')}
      >
        <span className={
          `view-switch__icon ${mode === 'landscape' ? 'active' : ''}`
        }><Landscape /></span>
        <span className={
          `view-switch__icon ${mode === 'portrait' ? 'active' : ''}`
        }><Portrait /></span>
      </div>
    </div>
  );
}

export default ViewSwitch;
