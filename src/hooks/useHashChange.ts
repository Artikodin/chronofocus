import { useEffect, useState } from 'react';

export const useHashChange = (callback?: () => void) => {
  const [hash, setHash] = useState(window.location.hash);

  const id = hash.replace('#', '');

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
      callback?.();
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [callback]);

  return { hash, id };
};
