import { atom, useAtom } from 'jotai';
import { useEffect } from 'react';

export const fullScreenAtom = atom(false);
export const cssFullScreenAtom = atom(false);
export function useFullscreen() : [boolean, (ele: HTMLElement) => void, (val: boolean) => void] {
  const [isFullscreen, setIsFullscreen] = useAtom(fullScreenAtom);
  const [isCssFullscreen, setIsCssFullscreen] = useAtom(cssFullScreenAtom);

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

  const toggleCssFullscreen = (val: boolean) => {
    console.log(val);
    setIsCssFullscreen(val);
  };

  document.onfullscreenchange = () => {
    if (!document.fullscreenElement) {
      setIsFullscreen(false);
    }
  };

  return [
    (isFullscreen || isCssFullscreen),
    toggleFullscreen,
    toggleCssFullscreen,
  ];
}
