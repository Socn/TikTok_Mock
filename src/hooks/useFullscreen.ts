import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

export const fullScreenAtom = atom(false);
export default function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useAtom(fullScreenAtom);

  const toggleFullscreen = (ele: HTMLElement) => {
    setIsFullscreen(val => {
      if (!val) {
        ele.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      return !val;
    });
  };

  document.onfullscreenchange = () => {
    if (!document.fullscreenElement) {
      setIsFullscreen(false);
    }
  };

  return { isFullscreen, toggleFullscreen };
}
