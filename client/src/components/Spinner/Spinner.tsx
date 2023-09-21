import React from 'react';
import './Spinner.scss';

function Spinner({ white }: { white?: boolean }) {
  return (
    <div className={`lds-spinner${white ? ' white' : ''}`}>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  );
}

export default Spinner;
