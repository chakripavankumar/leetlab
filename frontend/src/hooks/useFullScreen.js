import { useState } from "react";

const useFullScreen = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullscreen = () => {
    const element = document.documentElement;
    if (!document.fullscreenElement) {
      element.requestFullscreen?.().then(() => setIsFullScreen(true));
    } else {
      document.exitFullscreen?.().then(() => setIsFullScreen(false));
    }
  };
  return [isFullScreen, handleFullscreen];
};

export default useFullScreen;
