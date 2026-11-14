import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 배포 경로: https://ggungzzang2.github.io/byulgyeol/
// 로컬에서 루트(/)로 띄우고 싶으면 `npm run preview -- --base=/` 처럼 덮어쓴다.
export default defineConfig({
  base: '/byulgyeol/',
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5173, strictPort: true },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
});
