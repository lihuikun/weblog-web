/**
 * 上传响应类型
 */
export interface UploadResponse {
  key: string
  url: string
}

/**
 * 上传选项类型
 */
export interface UploadOptions {
  /** 自定义路径 */
  path?: string
  /** 认证密钥 */
  authKey?: string
}

/**
 * 上传进度回调类型
 */
export type UploadProgressCallback = (progress: number) => void
