import React, { useEffect, useState } from 'react';
import { getImage } from '../../../../helpers';
import { useStoryStore } from '../../../../store';
import { ChangeImageButton } from '../../../Buttons';
import './ListenStory.scss';

interface ListenStoryProps {
  isEdit?: boolean;
  story: UserStory
}

function ListenStory({ isEdit, story }: ListenStoryProps) {
  const {
    readStory,
    updateStoryAudioCover,
  } = useStoryStore();
  const allImages = readStory.story.map((page: IStoryPage) => page.image);
  const uniqueImages = Array.from(new Set(allImages));
  const [selectedImage, setSelectedImage] =
    useState<string>(story.audioCover || story.cover);
  const [index, setIndex] = useState<number>(uniqueImages
    .indexOf(selectedImage) || 0);

  useEffect(() => {
    if (!uniqueImages[index]) return setIndex(0);
    updateStoryAudioCover(readStory.id, uniqueImages[index]);
    setSelectedImage(uniqueImages[index]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <div className="listen-story">
      {getImage(selectedImage, 'cover',
        '460', '460',
        'story__finish-record-image')}
      {isEdit &&
        <ChangeImageButton
          isListen
          onClick={() => setIndex(index + 1)}
        />}
    </div>
  );
}

export default ListenStory;
