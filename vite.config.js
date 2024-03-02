import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import pluginRewriteAll from 'vite-plugin-rewrite-all'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    pluginRewriteAll()
  ],
})


// export default defineConfig(({ command, mode }) => {
//   const env = loadEnv(mode, process.cwd(), '');
//   return {
//       define: {
//           'import.meta.env.VITE_API_BASE': JSON.stringify(env.API_BASE),
//           'import.meta.env.VITE_API_BASE_IMG': JSON.stringify(env.API_BASE_IMG),
//           'import.meta.env.VITE_CLIENTCODE': JSON.stringify(env.CLIENTCODE),
//           'import.meta.env.VITE_TRANSUSERNAME': JSON.stringify(env.TRANSUSERNAME),
//           'import.meta.env.VITE_TRANSUSERPASSWORD': JSON.stringify(env.TRANSUSERPASSWORD),
//           'import.meta.env.VITE_AUTHKEY': JSON.stringify(env.AUTHKEY),
//           'import.meta.env.VITE_AUTHIV': JSON.stringify(env.AUTHIV),
//           'import.meta.env.VITE_CALLBACKURL': JSON.stringify(env.CALLBACKURL),

//           // If you want to exposes all env variables, which is not recommended
//           // 'import.meta.env.VITE_': env
//       },
//       plugins: [react(),pluginRewriteAll()],
//   };
// });