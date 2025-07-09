import React, { useState, useEffect, useMemo } from 'react';
import { Challenge, OperationType } from '../types';
import { CloseIcon, StarIcon } from './Icons';
import { CORRECT_ANSWERS_TTS, INCORRECT_ANSWERS_TTS, LEVEL_COMPLETE_TTS, OPERATIONS, ToucanIcon } from '../constants';

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const shuffleArray = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const generateChallenge = (operation: OperationType, level: number): Challenge => {
  let num1 = 0, num2 = 0, answer = 0;
  let question = '', questionTts = '', image;
  const options: number[] = [];

  switch (operation) {
    case OperationType.COUNTING:
      const min = (level - 1) * 4 + 1;
      const max = Math.min(level * 4, 20);
      answer = Math.floor(Math.random() * (max - min + 1)) + min;
      question = `Quantos tucanos você vê?`;
      questionTts = `Quantos tucanos você vê?`;
      image = (
        <div className={`grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-1 justify-center items-center`}>
            {Array.from({length: answer}).map((_, i) => <div key={i} className="animate-bounce-short flex justify-center items-center"><ToucanIcon className="w-8 h-8 sm:w-10 sm:h-10"/></div>)}
        </div>
      );
      break;
    case OperationType.ADDITION:
      num1 = Math.floor(Math.random() * (level * 2 + 2)) + 1;
      num2 = Math.floor(Math.random() * (level * 2 + 2)) + 1;
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
      questionTts = `Quanto é ${num1} mais ${num2}?`;
      break;
    case OperationType.SUBTRACTION:
      num1 = Math.floor(Math.random() * (level * 2 + 3)) + level;
      num2 = Math.floor(Math.random() * (num1 - 1)) + 1;
      answer = num1 - num2;
      question = `${num1} - ${num2} = ?`;
      questionTts = `Quanto é ${num1} menos ${num2}?`;
      break;
    case OperationType.MULTIPLICATION:
      const multipliers = [2, 3, 4, 5, 10];
      num1 = Math.floor(Math.random() * 5) + 1;
      num2 = multipliers[Math.min(level - 1, multipliers.length - 1)];
      if(Math.random() > 0.5) [num1, num2] = [num2, num1];
      answer = num1 * num2;
      question = `${num1} × ${num2} = ?`;
      questionTts = `Quanto é ${num1} vezes ${num2}?`;
      break;
  }
  
  options.push(answer);
  while (options.length < 4) {
    const wrongOption = answer + Math.floor(Math.random() * 5) - 2;
    if (wrongOption !== answer && !options.includes(wrongOption) && wrongOption >= 0) {
      options.push(wrongOption);
    }
  }

  return { type: operation, question, questionTts, options: shuffleArray(options), answer, image };
};


interface GameScreenProps {
  operation: OperationType;
  onClose: () => void;
  onProgressUpdate: (operation: OperationType, newStars: number) => void;
  speak: (text: string) => void;
  cancelSpeech: () => void;
  initialStars: number;
  isMuted: boolean;
}

export const GameScreen: React.FC<GameScreenProps> = ({ operation, onClose, onProgressUpdate, speak, cancelSpeech, initialStars, isMuted }) => {
  const [level, setLevel] = useState(initialStars);
  const [challenge, setChallenge] = useState<Challenge>(() => generateChallenge(operation, initialStars + 1));
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const operationConfig = useMemo(() => OPERATIONS.find(op => op.type === operation), [operation]);

  useEffect(() => {
    const tts = challenge.questionTts || challenge.question;
    if (!isMuted) {
      setTimeout(() => speak(tts), 500);
    }
    return () => cancelSpeech();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [challenge, isMuted]);

  const handleAnswer = (answer: number) => {
    if (feedback) return; 

    setSelectedAnswer(answer);
    if (answer === challenge.answer) {
      setFeedback('correct');
      if (!isMuted) speak(getRandomItem(CORRECT_ANSWERS_TTS));
      
      const newStars = level + 1;
      onProgressUpdate(operation, newStars);
      setLevel(newStars);
      
      setTimeout(() => {
         if (newStars === 5) {
            if (!isMuted) speak(`Uau! Você completou todos os desafios de ${operation.toLowerCase()}! Parabéns!`);
            setTimeout(onClose, 2500);
         } else {
            if (!isMuted) speak(LEVEL_COMPLETE_TTS);
            setChallenge(generateChallenge(operation, newStars + 1));
            setSelectedAnswer(null);
            setFeedback(null);
         }
      }, 1500);
    } else {
      setFeedback('incorrect');
      if (!isMuted) speak(getRandomItem(INCORRECT_ANSWERS_TTS));
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  return (
    <div className={`relative w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 text-center animate-fade-in-scale`}>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white bg-red-500/80 hover:bg-red-600/90 rounded-full p-2 transform transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Fechar desafio"
      >
        <CloseIcon />
      </button>

      <div className="mb-4">
        <h2 className={`text-2xl sm:text-3xl font-black uppercase tracking-wider text-white drop-shadow-md`}>{operation}</h2>
        <div className="flex justify-center my-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} filled={i < level} className="text-yellow-300 mx-1" />
            ))}
        </div>
      </div>
      
      <div className="bg-white/20 p-4 sm:p-6 rounded-2xl min-h-[12rem] sm:min-h-[15rem] flex flex-col items-center justify-center mb-6">
        {challenge.image ? (
            <div className="w-full">{challenge.image}</div>
        ) : (
            <p className="text-4xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-lg">{challenge.question}</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {challenge.options.map(option => {
          let buttonColor = operationConfig?.color || 'bg-blue-500';
          if (feedback && option === selectedAnswer) {
              buttonColor = feedback === 'correct' ? 'bg-green-500' : 'bg-red-500';
          }
          return (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              disabled={!!feedback}
              className={`${buttonColor} text-white font-black text-3xl sm:text-4xl rounded-2xl p-4 sm:p-6 shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 ${operationConfig?.ring} disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {option}
            </button>
          )
        })}
      </div>
    </div>
  );
};
