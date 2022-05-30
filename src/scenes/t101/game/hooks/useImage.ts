import { useEffect, useState } from 'react';

interface IState {
  image?: HTMLImageElement;
  status: string;
}

const defaultState: IState = { image: undefined, status: 'loading' };

const useImage = (url: string, crossOrigin?: string) => {
  const [res, setRes] = useState<IState>(defaultState);
  const image = res.image;

  useEffect(() => {
    if (!url) {
      return;
    }
    const img = document.createElement('img');

    function onload() {
      setRes({ image: img, status: 'loaded' });
    }

    function onerror() {
      setRes({ image: undefined, status: 'failed' });
    }

    img.addEventListener('load', onload);
    img.addEventListener('error', onerror);
    crossOrigin && (img.crossOrigin = crossOrigin);
    img.src = url;

    return function cleanup() {
      img.removeEventListener('load', onload);
      img.removeEventListener('error', onerror);
      setRes(defaultState);
    };
  }, [url, crossOrigin]);

  return [image];
};

export default useImage;
