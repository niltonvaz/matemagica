import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      
      // --- ADIÇÃO NECESSÁRIA PARA O RENDER ---
      preview: {
        host: true, // Permite que o Render se conecte a partir de qualquer host
        port: 10000 // O Render espera que os serviços rodem nesta porta por padrão
      }
      // --- FIM DA ADIÇÃO ---
    };
});