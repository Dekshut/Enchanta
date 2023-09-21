import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ReactComponent as Go,
} from '../../../../../images/content/preparatory/go.svg';
import {
  ReactComponent as One,
} from '../../../../../images/content/preparatory/one.svg';
import {
  ReactComponent as Three,
} from '../../../../../images/content/preparatory/three.svg';
import {
  ReactComponent as Two,
} from '../../../../../images/content/preparatory/two.svg';
import './Preparatory.scss';

function Preparatory() {
  const [preparatoryStep, setPreparatoryStep] = useState<number>(3);
  const [searchParams] = useSearchParams() || '';
  const isPreparatory = searchParams.get('preparatory') || '';

  useEffect(() => {
    if (isPreparatory && preparatoryStep !== 0) {
      const interval = setInterval(
        () => setPreparatoryStep(preparatoryStep - 1),
        1000);

      return () => {
        clearInterval(interval);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreparatory, preparatoryStep]);

  const getContent = (preparatoryStep: number) => {
    switch (preparatoryStep) {
    case 3:
      return (<Three />);
    case 2:
      return (<Two />);
    case 1:
      return (<One />);
    default:
      return (<Go />);
    }
  };

  return (
    <div className="preparatory">
      <div className="preparatory__inner">
        <div className="preparatory__header">
          {preparatoryStep === 0 ? null :
            <h3 className="preparatory__title title">
              Recording starts in…
            </h3>}
          <p className="preparatory__description">
            {getContent(preparatoryStep)}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Preparatory;
