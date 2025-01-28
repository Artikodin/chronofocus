import { useRef, useState, useEffect } from 'react';

export const useGetWindowSize = () => {
  const dpi = useRef(window.devicePixelRatio || 1);
  const initialWidth = useRef(window.innerWidth * dpi.current);
  const initialHeight = useRef(window.innerHeight * dpi.current);

  const [width, setWidth] = useState({ native: window.innerWidth, dpi: window.innerWidth * dpi.current });
  const [height, setHeight] = useState({ native: window.innerHeight, dpi: window.innerHeight * dpi.current });

  useEffect(() => {
    function handleResize() {
      setWidth({ native: window.innerWidth, dpi: window.innerWidth * dpi.current });
      setHeight({ native: window.innerHeight, dpi: window.innerHeight * dpi.current });
    }

    handleResize();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const heightRatio = height.dpi / initialHeight.current;
  const widthRatio = width.dpi / initialWidth.current;

  return { width, height, heightRatio, widthRatio, dpi };
};
