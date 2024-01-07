import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import electron from "vite-plugin-electron";
import electronRenderer from "vite-plugin-electron-renderer";
import polyfillExports from "vite-plugin-electron-renderer";
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        electron([
            {
                entry: "main/index.ts", // 主进程文件
            },
            {
                entry: "main/preload.ts",
            },
        ]),
        electronRenderer(),
        polyfillExports(),
    ],
    server: {
        port: 3000,
    },
    build: {
        emptyOutDir: false, // 默认情况下，若 outDir 在 root 目录下，则 Vite 会在构建时清空该目录
        outDir: "dist-electron",

        // vue
        chunkSizeWarningLimit: 1500, // 加大限制的大小将500kb改成1500kb或者更大
        rollupOptions: {
          output: {
            // manualChunks(id) {
            //   if (id.includes('node_modules')) {
            //     // 分解块，将大块分解成更小的块,在vite.config.js当中的build下面进行配置
            //     return id.toString().split('node_modules/')[1].split('/')[0].toString(); 
            //     // 但是生成的文件都在dist下面的assets文件下，里面既有js、css等等。
            //   }
            // },
            // 可以将不同的文件放在不同的文件下
            chunkFileNames: (chunkInfo) => {
              const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/') : [];
              const fileName = facadeModuleId[facadeModuleId.length - 2] || '[name]';
              return `js/${fileName}/[name].[hash].js`;
            }
          }
        },
    },
    resolve: {
        alias: {
            '@': path.resolve('./src')  // 相对路径别名配置, 用@代替src
        }
    },
    base: "./",
});
