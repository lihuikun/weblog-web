import request from '@/utils/request'

export interface AppFeatureConfigManage {
  id: number
  enabled: boolean
  config?: Record<string, unknown> | null
  updatedTime?: string
}

export function getFeatureConfigManage() {
  return request({ url: '/feature-switch/manage', method: 'get' })
}

export function updateFeatureConfigManage(data: {
  enabled?: boolean
  config?: Record<string, unknown> | null
}) {
  return request({ url: '/feature-switch/manage', method: 'put', data })
}
