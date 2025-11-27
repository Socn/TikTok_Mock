import { useEffect, useState } from 'react';

export default function useCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    return window.matchMedia('(min-width: 1240px)').matches === false;
  });

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) =>
      setCollapsed(e.matches === false);
    window
      .matchMedia('(min-width: 1240px)')
      .addEventListener('change', handler);
  }, []);

  return collapsed;
}
