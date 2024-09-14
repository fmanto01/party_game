import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // questo era qua per github
  // base: '/party_game/',
  plugins: [react()],
});
