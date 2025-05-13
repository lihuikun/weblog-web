import request from '@/utils/request';
import type { FormState, RegisterFormState, ResetFormState } from '@/types/form';


// 获取梦境大厅数据
export function getDreamHall() {
    return request({
        url: '/dream',
        method: 'get',
    });
}

// 获取我的梦境数据
export function getMyDreams() {
    return request({
        url: '/dream/my',
        method: 'get',
    });
}

// 创建梦境
export interface CreateDreamParams {
    title: string;
    content: string;
    emotion: string;
    tags: string[];
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
        method: 'put',
        data,
    });
} 