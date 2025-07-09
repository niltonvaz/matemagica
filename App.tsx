import React, { useState, useEffect, useCallback } from 'react';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { AuthScreen } from './components/AuthScreen';
import { OperationType, Progress, User } from './types';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';
import { useAudio } from './hooks/useAudio';
import { SoundOffIcon, SoundOnIcon, LogoutIcon } from './components/Icons';
import { api } from './api';

const initialProgress: Progress = {
  [OperationType.COUNTING]: 0,
  [OperationType.ADDITION]: 0,
  [OperationType.SUBTRACTION]: 0,
  [OperationType.MULTIPLICATION]: 0,
};

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'game'>('main');
  const [selectedOperation, setSelectedOperation] = useState<OperationType | null>(null);
  const [progress, setProgress] = useState<Progress>(initialProgress);
  
  const { speak, cancel } = useSpeechSynthesis();
  
  const musicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  const { toggle, isMuted, setIsMuted } = useAudio(musicUrl, true);

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      api.getProgress(currentUser.username)
        .then(savedProgress => {
          setProgress(savedProgress || initialProgress);
        })
        .catch(error => console.error("Falha ao buscar progresso:", error))
        .finally(() => setIsLoading(false));
    }
  }, [currentUser]);

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setCurrentView('main');
  };
  
  const handleLogout = () => {
      speak("Até a próxima!");
      setCurrentUser(null);
      setProgress(initialProgress);
  };

  const handleSelectOperation = useCallback((operation: OperationType) => {
    setSelectedOperation(operation);
    setCurrentView('game');
    cancel();
  }, [cancel]);

  const handleGameClose = useCallback(() => {
    setSelectedOperation(null);
    setCurrentView('main');
    cancel();
    if (currentUser) {
        speak(`Ótimo trabalho, ${currentUser.username}! Continue explorando os desafios.`);
    }
  }, [cancel, currentUser, speak]);

  const handleProgressUpdate = useCallback((operation: OperationType, newStars: number) => {
      setProgress(prev => {
          const updatedProgress = { ...prev, [operation]: Math.max(prev[operation], newStars) };
          if (currentUser) {
              api.saveProgress(currentUser.username, updatedProgress)
                 .catch(err => console.error("Falha ao salvar o progresso:", err));
          }
          return updatedProgress;
      });
  }, [currentUser]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toggle();
  };
  
  const renderContent = () => {
    if (isLoading) {
        return <div className="text-white text-4xl font-black">Carregando...</div>;
    }
    
    if (!currentUser) {
        return <AuthScreen onAuthSuccess={handleAuthSuccess} speak={speak} />;
    }

    if (currentView === 'game' && selectedOperation) {
      return (
        <GameScreen
          operation={selectedOperation}
          onClose={handleGameClose}
          onProgressUpdate={handleProgressUpdate}
          speak={speak}
          cancelSpeech={cancel}
          initialStars={progress[selectedOperation]}
          isMuted={isMuted}
        />
      );
    }
    return <MainMenu onSelectOperation={handleSelectOperation} progress={progress} speak={speak} username={currentUser.username} />;
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-blue-500 text-white font-sans overflow-hidden">
      <div className="absolute top-4 right-4 z-20 flex items-center gap-3">
        {currentUser && (
            <button
              onClick={handleLogout}
              className="p-3 rounded-full bg-white/30 hover:bg-white/50 text-white transition-transform duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-300"
              aria-label="Sair da conta"
            >
              <LogoutIcon />
            </button>
        )}
        <button
          onClick={toggleMute}
          className="p-3 rounded-full bg-white/30 hover:bg-white/50 text-white transition-transform duration-200 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          aria-label={isMuted ? 'Ligar som' : 'Desligar som'}
        >
          {isMuted ? <SoundOffIcon /> : <SoundOnIcon />}
        </button>
      </div>
      <div className="w-full max-w-4xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;
