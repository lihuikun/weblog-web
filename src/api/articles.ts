import { ApiResponse } from '@/types'
import request from '../utils/request'
export interface Articles {
  rows: any[];
  total: number;
}
export const getArticles = (params): Promise<ApiResponse<Articles>> => {
  return request.get('/articles', { params })
}