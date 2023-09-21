import React, { useEffect, useState } from 'react';
import { EditTextButton } from '../Buttons';
import './EditableParagraph.scss';

interface IEditableParagraph {
  isEdit?: boolean;
  text: string;
  className?: string;
  updateText?: (newText: string) => void;
}

function EditableParagraph(
  { isEdit, text, className, updateText }: IEditableParagraph
) {
  const [areaValue, setAreaValue] = useState(text);
  const [isEditing, setEditing] = useState(false);

  useEffect(() => { setAreaValue(text); }, [text]);

  const getText = (text: string): JSX.Element[] => {
    return text.split('<br/>').map((item: string, key: number) => {
      return <React.Fragment key={key}>{item}<br/></React.Fragment>;
    });
  };

  const getEditText = (text: string): string => {
    return text.split('<br/>').join(' ');
  };

  return (
    <>
      {isEditing ?
        <>
          <span className={`outline ${className}`}></span>
          <textarea
            className="editable-paragraph"
            autoFocus
            onFocus={(e) => {
              const temp_value = e.target.value;
              e.target.value = '';
              e.target.value = temp_value;
            }}
            onBlur={() => {
              updateText && updateText(areaValue);
              setEditing(false);
            }}
            value={areaValue || getEditText(text)}
            onChange={e => setAreaValue(e.target.value)}
          />
          {isEdit && <EditTextButton
            className={className}
            setEditing={() => setEditing(!isEditing)}
          />}
        </> :
        <>
          <p>
            {getText(text)}
          </p>
          {isEdit && <EditTextButton
            className={className}
            setEditing={() => setEditing(true)}
          />}
        </>
      }
    </>
  );
}

export default EditableParagraph;
