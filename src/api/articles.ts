import { ApiResponse } from '@/types'
import request from '../utils/request'
export interface Articles {
  rows: any[];
  total: number;
}
export interface Categories {
  rows: any[];
  total: number;
}
export interface Article {
  id?: number | string
  categoryId: number | string
  page?: number
  pageSize?: number
}
export const getArticles = (params: Article): Promise<ApiResponse<Articles>> => {
  return request.get('/articles', { params })
}

// 创建文章
export const createArticle = (data: any): Promise<ApiResponse<Articles>> => {
  return request.post('/articles', data)
}

// 更新文章
export const updateArticle = (article: any): Promise<ApiResponse<Articles>> => {
  return request.put(`/articles/${article.id}`, article)
}

// 删除文章
export const deleteArticle = (id: string): Promise<ApiResponse<Articles>> => {
  return request.delete(`/articles/${id}`)
}

// 获取分类
export const getCategories = (): Promise<ApiResponse<Categories>> => {
  return request.get('/categories')
}

