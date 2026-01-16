import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return;
            if (id.includes('recharts')) return 'charts';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('@radix-ui')) return 'radix';
            if (id.includes('@dnd-kit')) return 'dnd';
            if (id.includes('react-hook-form') || id.includes('@hookform/resolvers')) return 'forms';
            if (id.includes('lucide-react')) return 'icons';
            if (id.includes('react-hot-toast')) return 'toast';
            return 'vendor';
          }
        }
      }
    },
    define: {
      'import.meta.env.APP_URL': JSON.stringify(env.APP_URL),
    },
  };
});
