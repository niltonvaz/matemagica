import React, { useState } from 'react';
import { api } from '../api';
import { User } from '../types';
import { SpinnerIcon } from './Icons';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
  speak: (text: string) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, speak }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
        setError('Por favor, digite um nome de jogador.');
        return;
    }
    setError('');
    setIsLoading(true);

    try {
      const user = isLoginView
        ? await api.login(username, password)
        : await api.register(username, password);
      
      speak(isLoginView ? `Bem-vindo de volta, ${user.username}!` : `Olá, ${user.username}! Vamos começar a aventura!`);
      onAuthSuccess(user);

    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
      speak(err.message || 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-white animate-fade-in-scale">
      <h1 className="text-4xl sm:text-5xl font-black text-center text-yellow-300 drop-shadow-lg mb-6">
        {isLoginView ? 'Entrar' : 'Criar Conta'}
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg font-bold mb-2" htmlFor="username">
            Nome do Jogador
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border-2 border-transparent focus:border-yellow-300 rounded-lg w-full py-3 px-4 bg-white/20 text-white leading-tight focus:outline-none focus:shadow-outline transition-colors"
            placeholder="Super Criança"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-bold mb-2" htmlFor="password">
            Senha Secreta (opcional)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border-2 border-transparent focus:border-yellow-300 rounded-lg w-full py-3 px-4 bg-white/20 text-white leading-tight focus:outline-none focus:shadow-outline transition-colors"
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-red-400 bg-red-900/50 rounded-lg p-3 text-center mb-4">{error}</p>}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors flex items-center justify-center disabled:bg-yellow-700"
          >
            {isLoading && <SpinnerIcon />}
            {isLoading ? 'Aguarde...' : (isLoginView ? 'Jogar!' : 'Criar e Jogar!')}
          </button>
        </div>
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
            }}
            className="inline-block align-baseline font-bold text-sm text-yellow-200 hover:text-white"
          >
            {isLoginView ? 'Não tem uma conta? Crie uma agora!' : 'Já tem uma conta? Entre aqui!'}
          </button>
        </div>
      </form>
    </div>
  );
};
