import React from 'react';

export enum OperationType {
  COUNTING = 'Contagem',
  ADDITION = 'Adição',
  SUBTRACTION = 'Subtração',
  MULTIPLICATION = 'Multiplicação',
}

export type Progress = {
  [key in OperationType]: number;
};

export interface Challenge {
  type: OperationType;
  question: string;
  questionTts: string;
  options: number[];
  answer: number;
  image?: React.ReactNode;
}

export interface User {
  username: string;
  // Em um app real, NUNCA armazene senhas em texto plano.
  // Isso é apenas para fins de demonstração.
  password?: string;
}
