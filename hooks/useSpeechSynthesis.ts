import { useState, useCallback, useEffect } from 'react';

let voices: SpeechSynthesisVoice[] = [];

const loadVoices = () => {
  voices = window.speechSynthesis.getVoices();
};

// Load voices initially and on change
if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string, lang: string = 'pt-BR') => {
    if (!window.speechSynthesis) {
      console.warn("Speech Synthesis not supported by this browser.");
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find a suitable voice
    const ptVoice = voices.find(voice => voice.lang === lang);
    if (ptVoice) {
      utterance.voice = ptVoice;
    } else {
       const enVoice = voices.find(voice => voice.lang.startsWith('en-'));
       if(enVoice) utterance.voice = enVoice; // Fallback to English if Portuguese is not available
    }

    utterance.pitch = 1.1;
    utterance.rate = 0.9;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
        console.error('Speech synthesis error', e);
        setIsSpeaking(false);
    };
    
    window.speechSynthesis.speak(utterance);
  }, []);
  
  const cancel = useCallback(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, cancel, isSpeaking };
};
