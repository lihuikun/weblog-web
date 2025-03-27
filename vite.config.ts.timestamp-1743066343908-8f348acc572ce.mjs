// vite.config.ts
import { defineConfig, loadEnv } from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/vite@5.4.14_@types+node@22.13.9_terser@5.39.0/node_modules/vite/dist/node/index.js";
import vue from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/@vitejs+plugin-vue@5.2.1_vite@5.4.14_vue@3.5.13/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/unplugin-vue-components@28.4.1_vue@3.5.13/node_modules/unplugin-vue-components/dist/vite.js";
import { VantResolver } from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/unplugin-vue-components@28.4.1_vue@3.5.13/node_modules/unplugin-vue-components/dist/resolvers.js";
import path from "path";
import AutoImport from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/unplugin-auto-import@19.1.1/node_modules/unplugin-auto-import/dist/vite.js";
import svgLoader from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/vite-svg-loader@5.1.0_vue@3.5.13/node_modules/vite-svg-loader/index.js";
import { terser } from "file:///E:/vscode%20project/nestjs/weblog-web/node_modules/.pnpm/rollup-plugin-terser@7.0.2_rollup@2.79.2/node_modules/rollup-plugin-terser/rollup-plugin-terser.mjs";
var __vite_injected_original_dirname = "E:\\vscode project\\nestjs\\weblog-web";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log(env);
  return {
    plugins: [
      vue(),
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFx2c2NvZGUgcHJvamVjdFxcXFxuZXN0anNcXFxcd2VibG9nLXdlYlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRTpcXFxcdnNjb2RlIHByb2plY3RcXFxcbmVzdGpzXFxcXHdlYmxvZy13ZWJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L3ZzY29kZSUyMHByb2plY3QvbmVzdGpzL3dlYmxvZy13ZWIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUnXG5pbXBvcnQgQ29tcG9uZW50cyBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJ1xuaW1wb3J0IHsgVmFudFJlc29sdmVyIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gXCJ1bnBsdWdpbi1hdXRvLWltcG9ydC92aXRlXCI7XG5pbXBvcnQgc3ZnTG9hZGVyIGZyb20gXCJ2aXRlLXN2Zy1sb2FkZXJcIjtcbmltcG9ydCB7IHRlcnNlciB9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdGVyc2VyJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpXG4gIGNvbnNvbGUubG9nKGVudilcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICB2dWUoKSxcbiAgICAgIEF1dG9JbXBvcnQoe1xuICAgICAgICBpbXBvcnRzOiBbXCJ2dWVcIl0sXG4gICAgICAgIGR0czogXCJzcmMvYXV0by1pbXBvcnRzLmQudHNcIiwgLy8gXHU2MzA3XHU1QjlBXHU3NTFGXHU2MjEwXHU3Njg0XHU3QzdCXHU1NzhCXHU1OEYwXHU2NjBFXHU2NTg3XHU0RUY2XHU4REVGXHU1Rjg0XG4gICAgICAgIGVzbGludHJjOiB7XG4gICAgICAgICAgZW5hYmxlZDogdHJ1ZSwgLy8gXHU1OTgyXHU2NzlDXHU0RjdGXHU3NTI4IEVTTGludFx1RkYwQ1x1NUYwMFx1NTQyRlx1NkI2NFx1OTAwOVx1OTg3OVxuICAgICAgICAgIGZpbGVwYXRoOiBcIi4vLmVzbGludHJjLWF1dG8taW1wb3J0Lmpzb25cIixcbiAgICAgICAgfSxcbiAgICAgIH0pLFxuICAgICAgQ29tcG9uZW50cyh7XG4gICAgICAgIHJlc29sdmVyczogW1ZhbnRSZXNvbHZlcigpXVxuICAgICAgfSksXG4gICAgICBzdmdMb2FkZXIoKVxuICAgIF0sXG4gICAgcmVzb2x2ZToge1xuICAgICAgYWxpYXM6IHtcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKVxuICAgICAgfVxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICBwcm94eToge1xuICAgICAgICAnL2FwaSc6IHtcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX0FQSV9CQVNFX1VSTCxcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sICcnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICBwbHVnaW5zOiBbXG4gICAgICAgICAgdGVyc2VyKHtcbiAgICAgICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSwgLy8gXHU3OUZCXHU5NjY0IGNvbnNvbGUubG9nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICB9LFxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxUyxTQUFTLGNBQWMsZUFBZTtBQUMzVSxPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8sZUFBZTtBQUN0QixTQUFTLGNBQWM7QUFQdkIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsUUFBTSxNQUFNLFFBQVEsTUFBTSxRQUFRLElBQUksQ0FBQztBQUN2QyxVQUFRLElBQUksR0FBRztBQUNmLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLElBQUk7QUFBQSxNQUNKLFdBQVc7QUFBQSxRQUNULFNBQVMsQ0FBQyxLQUFLO0FBQUEsUUFDZixLQUFLO0FBQUE7QUFBQSxRQUNMLFVBQVU7QUFBQSxVQUNSLFNBQVM7QUFBQTtBQUFBLFVBQ1QsVUFBVTtBQUFBLFFBQ1o7QUFBQSxNQUNGLENBQUM7QUFBQSxNQUNELFdBQVc7QUFBQSxRQUNULFdBQVcsQ0FBQyxhQUFhLENBQUM7QUFBQSxNQUM1QixDQUFDO0FBQUEsTUFDRCxVQUFVO0FBQUEsSUFDWjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLFFBQ0wsUUFBUTtBQUFBLFVBQ04sUUFBUSxJQUFJO0FBQUEsVUFDWixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxRQUM5QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxlQUFlO0FBQUEsUUFDYixTQUFTO0FBQUEsVUFDUCxPQUFPO0FBQUEsWUFDTCxVQUFVO0FBQUEsY0FDUixjQUFjO0FBQUE7QUFBQSxZQUNoQjtBQUFBLFVBQ0YsQ0FBQztBQUFBLFFBQ0g7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
