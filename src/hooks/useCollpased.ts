import { useEffect, useState } from 'react';

export default function useCollapsed(width = 1240) {
  const [collapsed, setCollapsed] = useState(() => {
    return window.matchMedia(`(min-width: ${width}px)`).matches === false;
  });

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) =>
      setCollapsed(e.matches === false);
    window
      .matchMedia(`(min-width: ${width}px)`)
      .addEventListener('change', handler);
  }, [width]);

  return collapsed;
}
