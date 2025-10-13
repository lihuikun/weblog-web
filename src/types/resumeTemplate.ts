/**
 * 简历模板类型定义
 */
export interface ResumeTemplate {
  id: number
  name: string
  previewImageUrl: string
  downloadUrl: string
  isPremium: boolean
  color?: string
  createTime?: string
  updatedTime?: string
}

/**
 * 创建简历模板请求参数
 */
export interface CreateResumeTemplateRequest {
  name: string
  previewImageUrl: string
  downloadUrl: string
  isPremium: boolean
  color?: string
}

/**
 * 更新简历模板请求参数
 */
export interface UpdateResumeTemplateRequest {
  name?: string
  previewImageUrl?: string
  downloadUrl?: string
  isPremium?: boolean
  color?: string
}

/**
 * 简历模板列表响应
 */
export interface ResumeTemplateListResponse {
  data: ResumeTemplate[]
  total: number
}
