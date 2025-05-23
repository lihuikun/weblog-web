import request from '@/utils/request';
import { useUserStore } from '@/stores/userStore';
import { createSSEStream, SSEController } from '@/utils/sse';

// 获取梦境大厅数据
export function getDreamHall(params?: { page?: number; pageSize?: number }) {
    return request({
        url: '/dream',
        method: 'get',
        params
    });
}

// 获取我的梦境数据
export function getMyDreams(params?: { page?: number; pageSize?: number }) {
    return request({
        url: '/dream/my',
        method: 'get',
        params
    });
}

// 创建梦境
export interface CreateDreamParams {
    title?: string;
    content?: string;
    emotion?: string;
    tags?: string[];
    isShared?: boolean;
    interpretation?: string;
}

export function createDream(data: CreateDreamParams) {
    return request({
        url: '/dream',
        method: 'post',
        data,
    });
}

// 删除梦境
export function deleteDream(id: string) {
    return request({
        url: `/dream/${id}`,
        method: 'delete',
    });
}

// 更新梦境
export function updateDream(id: string, data: Partial<CreateDreamParams>) {
    return request({
        url: `/dream/${id}`,
        method: 'patch',
        data,
    });
}

// AI分析梦境
export function analyzeDream(id: string) {
    return request({
        url: `/dream/analyze/${id}`,
        method: 'post',
    });
}

// AI分析梦境（流式）
export async function analyzeDreamStream(
    id: number,
    onMessage: (content: string) => void,
    onComplete: () => void,
    onError: (error: any) => void
): Promise<SSEController> {
    return createSSEStream({
        url: `/api/dream/analyze/${id}`,
        method: 'POST',
        onMessage,
        onComplete,
        onError
    })
}

