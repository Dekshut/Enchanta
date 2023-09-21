import { TextField } from '@mui/material';
import React, {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import './CustomContent.scss';

interface CustomContentProps {
  variants: CardCharacterDetailsInfo[];
  selectedVariant: CardCharacterDetailsInfo;
  setSelectedVariant: Dispatch<SetStateAction<CardCharacterDetailsInfo>>;
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

function CustomContent({
  variants,
  selectedVariant,
  setSelectedVariant,
  value,
  setValue,
}: CustomContentProps) {
  const [label, setLabel] = useState<string>(variants[0].desc);

  useEffect(() => {
    if (selectedVariant.desc === variants[0].desc) {
      setValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant.desc]);

  useEffect(() => {
    if (value.length) {
      setSelectedVariant(variants[0]);
    }
    const timer = setTimeout(() => {
      value.length && setSelectedVariant(variants[0]);
      setValue(value);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onFocusOut = () => value ?
    setLabel(variants[0].label) : setLabel(variants[0].desc);

  const onSelectedRandomVariant = () => {
    setSelectedVariant(variants[1]);
    setLabel(variants[0].desc);
    setValue('');
  };

  const btnClass = `custom-content__button${selectedVariant
    .desc === variants[1].desc ? ' selected' : ''}`;

  return (
    <div className="custom-content">
      <TextField
        label={label}
        value={value}
        InputLabelProps={{ disableAnimation: true }}
        onFocus={() => setLabel(variants[0].label)}
        onBlur={onFocusOut}
        onChange={(event) =>
          setValue(event.target.value)}
      />
      <button
        type="button"
        className={btnClass}
        onClick={onSelectedRandomVariant}
      >
        <span className="custom-content__button-text">
          {variants[1].desc}
        </span>
      </button>
    </div>
  );
}

export default CustomContent;
