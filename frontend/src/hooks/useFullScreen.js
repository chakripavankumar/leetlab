import { useState } from 'react';

const useFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    const element = document.documentElement;

    if (!document.fullscreenElement) {
      element.requestFullscreen?.().then(() => setIsFullScreen(true));
    } else {
      document.exitFullscreen?.().then(() => setIsFullScreen(false));
    }
  };

  return [isFullScreen, handleFullScreen];
};

export default useFullScreen;
