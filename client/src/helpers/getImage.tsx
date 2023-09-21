import React from 'react';

export const getImage = (
  src: string,
  alt: string,
  width = '16',
  height = '16',
  className?: string,
) => {
  return (
    <img
      className={className}
      src={src}
      width={width}
      height={height}
      alt={alt}
    />
  );
};
