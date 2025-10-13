import request from '@/utils/request'
import type { 
  ResumeTemplate, 
  CreateResumeTemplateRequest, 
  UpdateResumeTemplateRequest,
  ResumeTemplateListResponse 
} from '@/types/resumeTemplate'

/**
 * 获取简历模板列表
 */
export function getResumeTemplateList(): Promise<ResumeTemplateListResponse> {
  return request.get('/resume-templates')
}

/**
 * 获取简历模板详情
 */
export function getResumeTemplate(id: number): Promise<ResumeTemplate> {
  return request.get(`/resume-templates/${id}`)
}

/**
 * 创建简历模板
 */
export function createResumeTemplate(data: CreateResumeTemplateRequest): Promise<ResumeTemplate> {
  return request.post('/resume-templates', data)
}

/**
 * 更新简历模板
 */
export function updateResumeTemplate(id: number, data: UpdateResumeTemplateRequest): Promise<ResumeTemplate> {
  return request.patch(`/resume-templates/${id}`, data)
}

/**
 * 删除简历模板
 */
export function deleteResumeTemplate(id: number): Promise<void> {
  return request.delete(`/resume-templates/${id}`)
}

/**
 * 下载简历模板
 */
export function downloadResumeTemplate(id: number): Promise<Blob> {
  return request.post(`/resume-templates/${id}/download`, {}, {
    responseType: 'blob'
  })
}
