import { defineConfig,loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import pluginRewriteAll from 'vite-plugin-rewrite-all'


// https://vitejs.dev/config/
export default defineConfig({

  plugins: [react(),
    // pluginRewriteAll()
  ],
})


// export default defineConfig(({ command, mode }) => {
//   const env = loadEnv(mode, process.cwd(), '');
//   return {
//       define: {
//           'process.env.API_BASE': JSON.stringify(env.API_BASE),
//           'process.env.YOUR_BOOLEAN_VARIABLE': env.YOUR_BOOLEAN_VARIABLE,
//           // If you want to exposes all env variables, which is not recommended
//           // 'process.env': env
//       },
//       plugins: [react(),pluginRewriteAll()],
//   };
// });