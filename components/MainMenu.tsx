import React, { useEffect } from 'react';
import { OperationType, Progress } from '../types';
import { OPERATIONS } from '../constants';
import { StarIcon } from './Icons';

interface MainMenuProps {
  onSelectOperation: (operation: OperationType) => void;
  progress: Progress;
  speak: (text: string) => void;
  username: string;
}

const StarRating = ({ count }: { count: number }) => (
  <div className="flex justify-center mt-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <StarIcon key={i} filled={i < count} className="text-yellow-300 w-5 h-5" />
    ))}
  </div>
);

const AnimalButton = ({ op, onSelect, stars }: { op: typeof OPERATIONS[0], onSelect: () => void, stars: number }) => {
  const { Icon, MathIcon, type, color, hover, ring } = op;
  return (
    <button
      onClick={onSelect}
      className={`relative rounded-2xl shadow-lg text-white p-4 w-full h-40 sm:h-48 md:h-56 flex flex-col justify-between items-center transform transition-transform duration-300 hover:-translate-y-2 ${color} ${hover} ${ring} focus:outline-none focus:ring-4`}
    >
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/30 rounded-full p-2">
        <MathIcon />
      </div>
      <div className="flex-grow flex items-center justify-center">
        <Icon />
      </div>
      <div className="text-center">
        <h3 className="font-black text-lg sm:text-xl md:text-2xl uppercase tracking-wider">{type}</h3>
        <StarRating count={stars} />
      </div>
    </button>
  );
};


export const MainMenu: React.FC<MainMenuProps> = ({ onSelectOperation, progress, speak, username }) => {
  useEffect(() => {
    speak(`Olá, ${username}! Bem-vindo de volta à Aventura Matemática! Escolha um desafio para começar!`);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-center animate-fade-in p-2">
       <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white drop-shadow-lg mb-2">Aventura</h1>
      <h2 className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-yellow-300 drop-shadow-lg mb-6 sm:mb-10">Matemática</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {OPERATIONS.map((op) => (
          <AnimalButton
            key={op.type}
            op={op}
            onSelect={() => onSelectOperation(op.type)}
            stars={progress[op.type]}
          />
        ))}
      </div>
    </div>
  );
};
