import { useState, useEffect } from 'react';

export function useWindowDimensions() {
  const hasWindow = typeof window !== 'undefined';
  const [windowDimensions, setWindowDimensions] = useState(() => ({
    width: hasWindow ? window.innerWidth : null,
    height: hasWindow ? window.innerHeight : null,
  }));

  useEffect(() => {
    if (hasWindow) {
      function handleResize() {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}
