import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import pluginRewriteAll from 'vite-plugin-rewrite-all'


// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(),
//     pluginRewriteAll()
//   ],
// })


export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
      define: {
          'process.env.API_BASE': JSON.stringify(env.API_BASE),
          'process.env.API_BASE_IMG': JSON.stringify(env.API_BASE_IMG),
          'process.env.CLIENTCODE': JSON.stringify(env.CLIENTCODE),
          'process.env.TRANSUSERNAME': JSON.stringify(env.TRANSUSERNAME),
          'process.env.TRANSUSERPASSWORD': JSON.stringify(env.TRANSUSERPASSWORD),
          'process.env.AUTHKEY': JSON.stringify(env.AUTHKEY),
          'process.env.AUTHIV': JSON.stringify(env.AUTHIV),
          'process.env.CALLBACKURL': JSON.stringify(env.CALLBACKURL),

          // If you want to exposes all env variables, which is not recommended
          // 'process.env.': env
      },
      plugins: [react(),pluginRewriteAll()],
  };
});