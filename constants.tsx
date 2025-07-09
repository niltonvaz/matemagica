import React from 'react';
import { OperationType } from './types';
import { AdditionIcon, SubtractionIcon, MultiplicationIcon, CountingIcon } from './components/Icons';

export const ToucanIcon = ({ className = "w-16 h-16 sm:w-20 sm:h-20" }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className}><g stroke="black" strokeWidth="2" fill="none"><path fill="#2c3e50" d="M40,20 C50,10 80,10 90,25 C100,40 95,60 80,70 L50,85 L35,65 Z" /><path fill="#f39c12" d="M40,20 C20,30 20,50 40,55 L40,20" /><path fill="#e74c3c" d="M40,55 C20,60 25,80 45,80 L50,85 L35,65 Z" /><path fill="#f1c40f" d="M80,70 C85,65 90,65 90,70 C90,75 85,75 80,70 Z" /><circle cx="70" cy="35" r="5" fill="white" /><circle cx="70" cy="35" r="2" fill="black" /></g></svg>
);

export const LionIcon = ({ className = "w-16 h-16 sm:w-20 sm:h-20" }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className}><g stroke="black" strokeWidth="2"><path fill="#e67e22" d="M20 80 L80 80 L80 90 L20 90Z" /><path fill="#f39c12" d="M50 20 A 30 30 0 0 1 50 80 A 30 30 0 0 1 50 20" /><path fill="#d35400" d="M50 5 A 45 45 0 0 0 50 95 M50 5 A 45 45 0 0 1 50 95 M5 50 A 45 45 0 0 0 95 50 M5 50 A 45 45 0 0 1 95 50" strokeWidth="4" strokeLinecap="round" /><circle cx="40" cy="45" r="5" fill="white" /><circle cx="40" cy="45" r="2" /><circle cx="60" cy="45" r="5" fill="white" /><circle cx="60" cy="45" r="2" /><path d="M45 65 A 5 5 0 0 0 55 65" fill="none" /></g></svg>
);

export const MonkeyIcon = ({ className = "w-16 h-16 sm:w-20 sm:h-20" }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className}><g stroke="black" strokeWidth="2"><path fill="#ecf0f1" d="M40 40 A 20 20 0 1 1 60 40 A 10 10 0 1 0 40 40" /><path fill="#95a5a6" d="M30 30 A 30 30 0 1 1 70 30 L 80 20 A 40 40 0 1 0 20 20 Z" /><circle cx="45" cy="50" r="4" fill="black" /><circle cx="55" cy="50" r="4" fill="black" /><path d="M45 65 Q 50 70 55 65" fill="none" /><path fill="#7f8c8d" d="M20,60 C0,70 0,90 25,90 S 40,80 40,60" /><path fill="#7f8c8d" d="M80,60 C100,70 100,90 75,90 S 60,80 60,60" /></g></svg>
);

export const ElephantIcon = ({ className = "w-16 h-16 sm:w-20 sm:h-20" }: { className?: string }) => (
    <svg viewBox="0 0 100 100" className={className}><g stroke="black" strokeWidth="2"><path fill="#bdc3c7" d="M20 40 C 10 20, 40 5, 50 20 S 90 20, 80 40 C 100 60, 80 95, 50 85 S 0 60, 20 40 Z" /><path fill="#95a5a6" d="M20 40 C 25 20, 30 25, 30 40 C 30 50, 25 55, 20 50" /><path fill="#95a5a6" d="M80 40 C 75 20, 70 25, 70 40 C 70 50, 75 55, 80 50" /><path fill="white" d="M50 70 Q 40 80 30 90 C 40 95, 60 95, 70 90 Q 60 80 50 70" /><circle cx="45" cy="45" r="3" fill="black" /><circle cx="55" cy="45" r="3" fill="black" /></g></svg>
);


export const OPERATIONS = [
  {
    type: OperationType.COUNTING,
    Icon: ToucanIcon,
    MathIcon: CountingIcon,
    color: 'bg-green-500',
    hover: 'hover:bg-green-600',
    ring: 'focus:ring-green-300'
  },
  {
    type: OperationType.ADDITION,
    Icon: LionIcon,
    MathIcon: AdditionIcon,
    color: 'bg-red-500',
    hover: 'hover:bg-red-600',
    ring: 'focus:ring-red-300'
  },
  {
    type: OperationType.SUBTRACTION,
    Icon: MonkeyIcon,
    MathIcon: SubtractionIcon,
    color: 'bg-yellow-500',
    hover: 'hover:bg-yellow-600',
    ring: 'focus:ring-yellow-300'
  },
  {
    type: OperationType.MULTIPLICATION,
    Icon: ElephantIcon,
    MathIcon: MultiplicationIcon,
    color: 'bg-purple-500',
    hover: 'hover:bg-purple-600',
    ring: 'focus:ring-purple-300'
  },
];

export const CORRECT_ANSWERS_TTS = [
    "Excelente!", "Muito bem!", "Isso mesmo!", "Você conseguiu!", "Incrível!", "Continue assim!"
];

export const INCORRECT_ANSWERS_TTS = [
    "Ops, tente de novo.", "Quase lá, tente mais uma vez.", "Não foi dessa vez. Você consegue!", "Tente novamente."
];

export const LEVEL_COMPLETE_TTS = "Uau, você passou de nível!";
