import { useState, useEffect } from 'react';

export const useMediaQuery = () => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth <= 1280 && window.innerWidth > 1024) {
        setQuery('xl');
      } else if (window.innerWidth <= 1024 && window.innerWidth > 768) {
        setQuery('lg');
      } else if (window.innerWidth <= 768 && window.innerWidth > 640) {
        setQuery('md');
      } else if (window.innerWidth <= 640) {
        setQuery('sm');
      } else {
        setQuery('default');
      }
    };

    window.addEventListener('resize', checkMobile);
    checkMobile();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return query;
};
