import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    build: {
      target: 'esnext'
    },
    define: {
      "process.env.BUCKET_NAME": JSON.stringify(env.BUCKET_NAME),
      "process.env.BUCKET_REGION": JSON.stringify(env.BUCKET_REGION),
      "process.env.ACCESS_KEY": JSON.stringify(env.ACCESS_KEY),
      "process.env.SECRET_ACCESS_KEY": JSON.stringify(env.SECRET_ACCESS_KEY),
      "process.env.DEV": JSON.stringify(env.DEV),
    },
    plugins: [react()],
  };
});
