import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    build: {
      target: 'esnext'
    },
    define: {
      "${{env.BUCKET_NAME}}": JSON.stringify(env.BUCKET_NAME),
      "${{env.BUCKET_REGION}}": JSON.stringify(env.BUCKET_REGION),
      "${{env.ACCESS_KEY}}": JSON.stringify(env.ACCESS_KEY),
      "${{env.SECRET_ACCESS_KEY}}": JSON.stringify(env.SECRET_ACCESS_KEY),
      "process.env.DEV": JSON.stringify(env.DEV),
    },
    plugins: [react()],
  };
});
