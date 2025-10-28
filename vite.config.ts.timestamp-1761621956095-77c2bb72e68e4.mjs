// vite.config.ts
import { defineConfig, loadEnv } from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/vite@5.4.14_@types+node@22.13.9_sass@1.87.0_terser@5.39.0/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@5.4.14_vue@3.5.13/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/unplugin-vue-components@28.4.1_vue@3.5.13/node_modules/unplugin-vue-components/dist/vite.js";
import { VantResolver } from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/unplugin-vue-components@28.4.1_vue@3.5.13/node_modules/unplugin-vue-components/dist/resolvers.js";
import path from "path";
import AutoImport from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/unplugin-auto-import@19.1.1_@vueuse+core@13.2.0/node_modules/unplugin-auto-import/dist/vite.js";
import svgLoader from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/vite-svg-loader@5.1.0_vue@3.5.13/node_modules/vite-svg-loader/index.js";
import { terser } from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/rollup-plugin-terser@7.0.2_rollup@2.79.2/node_modules/rollup-plugin-terser/rollup-plugin-terser.mjs";
import vueJsx from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/@vitejs+plugin-vue-jsx@4.2.0_vite@5.4.14_vue@3.5.13/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
var __vite_injected_original_dirname = "E:\\vscode project\\nestjs\\weblog-web";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log(env);
  return {
    plugins: [
      vue(),
      vueJsx(),
      AutoImport({
        imports: ["vue"],
        dts: "src/auto-imports.d.ts",
        // 指定生成的类型声明文件路径
        eslintrc: {
          enabled: true,
          // 如果使用 ESLint，开启此选项
          filepath: "./.eslintrc-auto-import.json"
        }
      }),
      Components({
        resolvers: [VantResolver()]
      }),
      svgLoader()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api/, "")
        },
        "/upload": {
          target: env.VITE_UPLOAD_BASE_URL,
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/upload/, "")
        },
        "/r2-upload": {
          target: "https://upload-web.lihk180.dpdns.org",
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/r2-upload/, "")
        }
      }
    },
    build: {
      rollupOptions: {
        plugins: [
          terser({
            compress: {
              drop_console: true
              // 移除 console.log
            }
          })
        ]
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx2c2NvZGUgcHJvamVjdFxcXFxuZXN0anNcXFxcd2VibG9nLXdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcdnNjb2RlIHByb2plY3RcXFxcbmVzdGpzXFxcXHdlYmxvZy13ZWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3ZzY29kZSUyMHByb2plY3QvbmVzdGpzL3dlYmxvZy13ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IENvbXBvbmVudHMgZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSdcclxuaW1wb3J0IHsgVmFudFJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xyXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xyXG5pbXBvcnQgc3ZnTG9hZGVyIGZyb20gXCJ2aXRlLXN2Zy1sb2FkZXJcIjtcclxuaW1wb3J0IHsgdGVyc2VyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi10ZXJzZXInO1xyXG5pbXBvcnQgdnVlSnN4IGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZS1qc3gnXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpXHJcbiAgY29uc29sZS5sb2coZW52KVxyXG4gIHJldHVybiB7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHZ1ZSgpLFxyXG4gICAgICB2dWVKc3goKSxcclxuICAgICAgQXV0b0ltcG9ydCh7XHJcbiAgICAgICAgaW1wb3J0czogW1widnVlXCJdLFxyXG4gICAgICAgIGR0czogXCJzcmMvYXV0by1pbXBvcnRzLmQudHNcIiwgLy8gXHU2MzA3XHU1QjlBXHU3NTFGXHU2MjEwXHU3Njg0XHU3QzdCXHU1NzhCXHU1OEYwXHU2NjBFXHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0XHJcbiAgICAgICAgZXNsaW50cmM6IHtcclxuICAgICAgICAgIGVuYWJsZWQ6IHRydWUsIC8vIFx1NTk4Mlx1Njc5Q1x1NEY3Rlx1NzUyOCBFU0xpbnRcdUZGMENcdTVGMDBcdTU0MkZcdTZCNjRcdTkwMDlcdTk4NzlcclxuICAgICAgICAgIGZpbGVwYXRoOiBcIi4vLmVzbGludHJjLWF1dG8taW1wb3J0Lmpzb25cIixcclxuICAgICAgICB9LFxyXG4gICAgICB9KSxcclxuICAgICAgQ29tcG9uZW50cyh7XHJcbiAgICAgICAgcmVzb2x2ZXJzOiBbVmFudFJlc29sdmVyKCldXHJcbiAgICAgIH0pLFxyXG4gICAgICBzdmdMb2FkZXIoKVxyXG4gICAgXSxcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpXHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcHJveHk6IHtcclxuICAgICAgICAnL2FwaSc6IHtcclxuICAgICAgICAgIHRhcmdldDogZW52LlZJVEVfQVBJX0JBU0VfVVJMLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgJy91cGxvYWQnOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX1VQTE9BRF9CQVNFX1VSTCxcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC91cGxvYWQvLCAnJylcclxuICAgICAgICB9LFxyXG4gICAgICAgICcvcjItdXBsb2FkJzoge1xyXG4gICAgICAgICAgdGFyZ2V0OiAnaHR0cHM6Ly91cGxvYWQtd2ViLmxpaGsxODAuZHBkbnMub3JnJyxcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9yMi11cGxvYWQvLCAnJylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICBidWlsZDoge1xyXG4gICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgICAgdGVyc2VyKHtcclxuICAgICAgICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsIC8vIFx1NzlGQlx1OTY2NCBjb25zb2xlLmxvZ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgfSksXHJcbiAgICAgICAgXSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfVxyXG59KVxyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFTLFNBQVMsY0FBYyxlQUFlO0FBQzNVLE9BQU8sU0FBUztBQUNoQixPQUFPLGdCQUFnQjtBQUN2QixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFVBQVU7QUFDakIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxlQUFlO0FBQ3RCLFNBQVMsY0FBYztBQUN2QixPQUFPLFlBQVk7QUFSbkIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUN2QyxVQUFRLElBQUksR0FBRztBQUNmLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLElBQUk7QUFBQSxNQUNKLE9BQU87QUFBQSxNQUNQLFdBQVc7QUFBQSxRQUNULFNBQVMsQ0FBQyxLQUFLO0FBQUEsUUFDZixLQUFLO0FBQUE7QUFBQSxRQUNMLFVBQVU7QUFBQSxVQUNSLFNBQVM7QUFBQTtBQUFBLFVBQ1QsVUFBVTtBQUFBLFFBQ1o7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNELFdBQVc7QUFBQSxRQUNULFdBQVcsQ0FBQyxhQUFhLENBQUM7QUFBQSxNQUM1QixDQUFDO0FBQUEsTUFDRCxVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUSxJQUFJO0FBQUEsVUFDWixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxRQUM5QztBQUFBLFFBQ0EsV0FBVztBQUFBLFVBQ1QsUUFBUSxJQUFJO0FBQUEsVUFDWixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxhQUFhLEVBQUU7QUFBQSxRQUNqRDtBQUFBLFFBQ0EsY0FBYztBQUFBLFVBQ1osUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsZ0JBQWdCLEVBQUU7QUFBQSxRQUNwRDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsUUFDYixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsWUFDTCxVQUFVO0FBQUEsY0FDUixjQUFjO0FBQUE7QUFBQSxZQUNoQjtBQUFBLFVBQ0YsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
