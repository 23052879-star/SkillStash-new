import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Custom Vite plugin to handle Cashfree API proxy as middleware
function cashfreeApiPlugin() {
  return {
    name: 'cashfree-api-middleware',
    configureServer(server: any) {
      server.middlewares.use('/api/cashfree', async (req: any, res: any, next: any) => {
        // Only handle POST requests
        if (req.method !== 'POST') {
          return next();
        }

        const env = loadEnv('development', process.cwd(), '');
        const appId = env.VITE_CASHFREE_APP_ID || '';
        const secretKey = env.VITE_CASHFREE_SECRET_KEY || '';

        // Read the request body
        let body = '';
        for await (const chunk of req) {
          body += chunk;
        }

        // Determine the Cashfree API path
        const apiPath = req.url || '';
        const cashfreeUrl = `https://api.cashfree.com/pg${apiPath}`;

        try {
          const response = await fetch(cashfreeUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'x-client-id': appId,
              'x-client-secret': secretKey,
              'x-api-version': '2025-01-01',
            },
            body: body,
          });

          const responseText = await response.text();

          // Forward the status code and response
          res.writeHead(response.status, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          });
          res.end(responseText);
        } catch (err: any) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message || 'Failed to connect to Cashfree API' }));
        }
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cashfreeApiPlugin()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
