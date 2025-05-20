import request from '@/utils/request';

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

