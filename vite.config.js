import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // external access allow karta hai
    allowedHosts: ['lophodont-inertly-maryanna.ngrok-free.dev'], // specific ngrok host
    cors: true
  }
});
