import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import AutoImport from "unplugin-auto-import/vite";
import svgLoader from "vite-svg-loader";
import { terser } from 'rollup-plugin-terser';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  console.log(env)
  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ["vue"],
        dts: "src/auto-imports.d.ts", // 指定生成的类型声明文件路径
        eslintrc: {
          enabled: true, // 如果使用 ESLint，开启此选项
          filepath: "./.eslintrc-auto-import.json",
        },
      }),
      Components({
        resolvers: [VantResolver()]
      }),
      svgLoader()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      rollupOptions: {
        plugins: [
          terser({
            compress: {
              drop_console: true, // 移除 console.log
            },
          }),
        ],
      },
    },
  }
})
