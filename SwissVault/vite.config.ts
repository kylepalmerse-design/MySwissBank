import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // ← ЭТА СТРОКА ГАСИТ ОШИБКУ Rollup failed to resolve /src/main.tsx
    rollupOptions: {
      external: [],
    },
      // Это подавляет предупреждение в проде
  resolve: {
    preserveSymlinks: true,
  },
  },
});
