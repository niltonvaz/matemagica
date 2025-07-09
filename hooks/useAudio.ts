import { useState, useEffect, useMemo } from 'react';

export const useAudio = (url: string, loop: boolean = false) => {
  const audio = useMemo(() => new Audio(url), [url]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggle = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    audio.loop = loop;
    audio.muted = isMuted;
  }, [audio, loop, isMuted]);

  useEffect(() => {
    if (isPlaying && !isMuted) {
      audio.play().catch(e => console.error("Audio play failed:", e));
    } else {
      audio.pause();
    }
  }, [isPlaying, isMuted, audio]);

  useEffect(() => {
    const handleCanPlay = () => {
      // Autoplay can be tricky. We can try to play here if needed.
    };
    audio.addEventListener('canplay', handleCanPlay);
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.pause();
    };
  }, [audio]);

  return { isPlaying, toggle, isMuted, setIsMuted };
};
