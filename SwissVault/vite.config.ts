import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  // ← ЭТА СТРОКА УБИРАЕТ ОШИБКУ С /src/main.tsx В ПРОДЕ
  server: {
    open: true,
  },
  // Это позволяет Vite обрабатывать /src/main.tsx как entry в dev и prod
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
