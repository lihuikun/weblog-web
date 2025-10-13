import type { EnvConfig } from '@/types/env'

/**
 * 环境变量配置
 */
export const env: EnvConfig = {
  R2_UPLOAD_URL: import.meta.env.VITE_R2_UPLOAD_URL || '/r2-upload',
  R2_AUTH_KEY: import.meta.env.VITE_R2_AUTH_KEY || 'lihklihk',
}
