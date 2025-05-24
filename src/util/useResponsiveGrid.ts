import { useEffect } from 'react';

export const useResponsiveGrid = (rootSel = '.selection-grid') => {
  useEffect(() => {
    const resize = () => {
      const root = document.querySelector<HTMLElement>(rootSel);
      if (!root) return;
      const cols = window.innerWidth >= 1280 ? 3 : window.innerWidth >= 768 ? 2 : 1;
      root.style.gridTemplateColumns = `repeat(${cols}, minmax(0,1fr))`;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [rootSel]);
}; 