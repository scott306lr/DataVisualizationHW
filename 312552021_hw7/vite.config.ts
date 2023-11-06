import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      lodash: 'lodash-es'
    }
  },
  plugins: [react()],

  //build the files to the dist folder directly, not inside dist/assets
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "",

    rollupOptions: {
      //custom naming: 31255112.js, 31255112.css, etc.
      output: {
        entryFileNames: "312552021.js",
        chunkFileNames: "312552021_[hash].js",
        assetFileNames: "312552021_[hash].[ext]",
      },
    },
  },
});
