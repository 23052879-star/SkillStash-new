import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      proxy: {
        '/api/cashfree': {
          target: 'https://api.cashfree.com/pg',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/cashfree/, ''),
          headers: {
            'x-client-id': env.VITE_CASHFREE_APP_ID || '',
            'x-client-secret': env.VITE_CASHFREE_SECRET_KEY || '',
            'x-api-version': '2023-08-01',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        }
      }
    }
  };
});
