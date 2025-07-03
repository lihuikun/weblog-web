import request from '@/utils/request'

export interface InterviewCategory {
    id: number;
    name: string;
}

export interface Interview {
    id: number;
    title: string;
    question: string;
    answer?: string;
    categoryId: number;
    category?: InterviewCategory;
    difficulty: number;
    requirePremium: boolean;
    createTime: string;
    updateTime: string;
}

export interface CreateInterviewDto {
    title: string;
    question: string;
    answer: string;
    categoryId: number;
    difficulty: number;
    requirePremium: boolean;
}

export interface UpdateInterviewDto {
    title?: string;
    question?: string;
    answer?: string;
    categoryId?: number;
    difficulty?: number;
    requirePremium?: boolean;
}

// 获取面试题列表
export function getInterviewList(params: {
    page: number;
    pageSize: number;
    categoryId?: number;
    difficulty?: number;
    requirePremium?: boolean;
}) {
    return request({
        url: '/interviews',
        method: 'get',
        params
    })
}

// 获取面试题详情
export function getInterview(id: number) {
    return request({
        url: `/interviews/${id}`,
        method: 'get'
    })
}

// 获取面试题答案
export function getInterviewAnswer(id: number) {
    return request({
        url: `/interviews/${id}/answer`,
        method: 'get'
    })
}

// 创建面试题
export function createInterview(data: CreateInterviewDto) {
    return request({
        url: '/interviews',
        method: 'post',
        data
    })
}

// 更新面试题
export function updateInterview(id: number, data: UpdateInterviewDto) {
    return request({
        url: `/interviews/${id}`,
        method: 'patch',
        data
    })
}

// 删除面试题
export function deleteInterview(id: number) {
    return request({
        url: `/interviews/${id}`,
        method: 'delete'
    })
} 