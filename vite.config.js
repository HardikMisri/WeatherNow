import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // Or '@vitejs/plugin-vue', etc.

export default defineConfig({
  plugins: [react()], // Or [vue()], etc.
});