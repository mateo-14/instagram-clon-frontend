import { useState, useEffect } from 'react';
export default function useImageDimensions(src) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      setWidth(image.naturalWidth);
      setHeight(image.naturalHeight);
    };
  }, [src]);

  return { width, height };
}
