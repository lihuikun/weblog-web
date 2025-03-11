import { ApiResponse } from '@/types'
import request from '../utils/request'
export interface PV {
  totalPv: number;
  todayPv: number;
}
export const getPV = (): Promise<ApiResponse<PV>> => {
  return request.get('/pv/total')
}