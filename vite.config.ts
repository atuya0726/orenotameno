import { defineConfig } from 'vitest/config';
import { loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
import worker from './src/worker';

// This middleware runs in Node, never in the browser bundle. Deployment uses the same Worker handler.
function glossaryApi(env: Record<string, string>): Plugin {
  return { name: 'glossary-api', configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (!req.url?.startsWith('/api/')) { next(); return; }
      try {
        const chunks: Buffer[] = []; let size = 0;
        for await (const chunk of req) {
          const bytes = Buffer.from(chunk); size += bytes.length;
          if (size > 32_000) { res.writeHead(413, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify({ error: '説明が長すぎます。' })); return; }
          chunks.push(bytes);
        }
        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) { if (value !== undefined) headers.set(key, Array.isArray(value) ? value.join(', ') : value); }
        const method = req.method ?? 'GET';
        const body = method === 'GET' || method === 'HEAD' ? undefined : Buffer.concat(chunks);
        const response = await worker.fetch(new Request(`http://${req.headers.host ?? '127.0.0.1:5173'}${req.url}`, { method, headers, body }), env);
        res.writeHead(response.status, Object.fromEntries(response.headers)); res.end(Buffer.from(await response.arrayBuffer()));
      } catch { res.writeHead(500, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); res.end(JSON.stringify({ error: 'AI評価に接続できませんでした。入力した説明は残っています。' })); }
    });
  } };
}
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), glossaryApi(loadEnv(mode, process.cwd(), ''))],
  resolve: {
    // ONNX loads and caches its versioned runtime from the CDN. Keep the >25 MiB
    // WASM file out of Worker static assets, whose per-file upload limit is 25 MiB.
    conditions: ['onnxruntime-web-use-extern-wasm', 'module', 'browser', 'development|production'],
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: { include: ['src/**/*.test.{ts,tsx}'] },
}));
