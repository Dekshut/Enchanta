import React, { useEffect, useState } from 'react';
import { useStoryStore } from '../../store';
import { ChangeImageButton } from '../Buttons';
import Spinner from '../Spinner';
import './EditableCover.scss';

interface IEditableCover {
  isEdit?: boolean;
  url: string;
  className: string;
  isPortrait?: boolean;
  onUpdate: (newImage: string) => void;
  pageId: number;
  dublicate?: boolean;
}

function EditableCover({
  url,
  isEdit,
  className,
  isPortrait,
  onUpdate,
  pageId,
  dublicate,
}: IEditableCover) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loader, setLoader] = useState<boolean>(false);
  const {
    fetchGenerateImage,
  } = useStoryStore((store: IStoryActions) => store);

  useEffect(() => {
    if (imageUrl) {
      setLoader(false);
    }
  }, [imageUrl]);

  return (
    <div className="editable-cover">
      {loader ?
        <div className={className}>
          <div className="editable-cover__inner">
            <Spinner />
          </div>
        </div> :
        <img
          className={className + (dublicate ? ' dublicate' : '')}
          src={imageUrl || url}
          alt="mouse"
        />}
      {isEdit && !dublicate &&
        <ChangeImageButton
          disabled={loader}
          isPortrait={isPortrait}
          onClick={() => {
            setLoader(true);
            setImageUrl(null);
            fetchGenerateImage(pageId)
              .then(newUrl => {
                setImageUrl(newUrl);
                onUpdate(newUrl);
              });
          }}
        />}
    </div>
  );
}

export default EditableCover;
