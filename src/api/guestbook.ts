import request from '@/utils/request'

/**
 * 留言实体接口
 */
export interface Guestbook {
  id: number
  nickname: string
  avatarUrl?: string
  content: string
  ip: string
  createdAt: string
  updatedTime: string
}

/**
 * 留言列表响应
 */
export interface GuestbookListResponse {
  list: Guestbook[]
  total: number
}

/**
 * 创建留言参数
 */
export interface CreateGuestbookDto {
  nickname: string
  avatarUrl?: string
  content: string
}

/**
 * 获取留言列表
 */
export function getGuestbookList() {
  return request.get<GuestbookListResponse>('/guestbook')
}

/**
 * 创建留言
 */
export function createGuestbook(data: CreateGuestbookDto) {
  return request.post('/guestbook', data)
}

/**
 * 删除留言
 */
export function deleteGuestbook(id: number) {
  return request.delete(`/guestbook/${id}`)
}
