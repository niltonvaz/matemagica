import { User, Progress, OperationType } from './types';

// Simula um banco de dados de usuários usando localStorage
const getUsers = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem('math_users_db') || '{}');
  } catch {
    return {};
  }
};

const saveUsers = (users: Record<string, string>) => {
  localStorage.setItem('math_users_db', JSON.stringify(users));
};

// Simula um banco de dados de progresso de usuários
const getProgressForUser = (username: string): Progress | null => {
  try {
    const progress = localStorage.getItem(`math_progress_db_${username}`);
    return progress ? JSON.parse(progress) : null;
  } catch {
    return null;
  }
};

const saveProgressForUser = (username: string, progress: Progress) => {
  localStorage.setItem(`math_progress_db_${username}`, JSON.stringify(progress));
};

const createInitialProgress = (): Progress => ({
    [OperationType.COUNTING]: 0,
    [OperationType.ADDITION]: 0,
    [OperationType.SUBTRACTION]: 0,
    [OperationType.MULTIPLICATION]: 0,
});

// Funções da API que simulam chamadas de rede
export const api = {
  register: (username: string, password?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        if (users[username]) {
          reject(new Error('Este nome de usuário já existe.'));
        } else {
          // Em um app real, o backend deve gerar um hash da senha!
          users[username] = password || '';
          saveUsers(users);
          const newUser: User = { username };
          saveProgressForUser(username, createInitialProgress());
          resolve(newUser);
        }
      }, 500);
    });
  },

  login: (username: string, password?: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = getUsers();
        // Em um app real, o backend deve comparar hashes de senha!
        if (users[username] !== undefined && users[username] === (password || '')) {
           resolve({ username });
        } else {
           reject(new Error('Nome de usuário ou senha inválidos.'));
        }
      }, 500);
    });
  },

  getProgress: (username: string): Promise<Progress> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              let progress = getProgressForUser(username);
              if (!progress) {
                  progress = createInitialProgress();
                  saveProgressForUser(username, progress);
              }
              resolve(progress);
          }, 300);
      });
  },

  saveProgress: (username: string, progress: Progress): Promise<void> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              saveProgressForUser(username, progress);
              resolve();
          }, 300);
      })
  }
};
