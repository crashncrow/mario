import { useState, useEffect } from 'react';

export function useWindowDimensions() {
  const hasWindow = typeof window !== 'undefined';
  const [windowDimensions, setWindowDimensions] = useState({
    width: null,
    height: null,
  });

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      handleResize()
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}
