import { ApiResponse } from '@/types'
import request from '../utils/request'

export const getHotSearch = (params): Promise<ApiResponse<any>> => {
  return request.get('/hot-search', { params})
}