/// <reference types="vite/client" />
declare module "*.vue" {
  import { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_UPLOAD_BASE_URL: string;
  readonly VITE_CRYPTO_KEY: string;
  readonly VITE_GITHUB_CLIENT_ID: string;
  // 可以添加更多环境变量类型
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}