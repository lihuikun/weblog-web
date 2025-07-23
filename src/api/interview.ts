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
    isFavorited: boolean; // 是否已收藏
    isLiked: boolean;     // 是否已点赞
    likeCount: number;    // 点赞数量
    favoriteCount: number; // 收藏数量
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

// 获取前端宝典列表
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

// 获取前端宝典详情
export function getInterview(id: number) {
    return request({
        url: `/interviews/${id}`,
        method: 'get'
    })
}

// 获取前端宝典答案
export function getInterviewAnswer(id: number) {
    return request({
        url: `/interviews/${id}/answer`,
        method: 'get'
    })
}

// 创建前端宝典
export function createInterview(data: CreateInterviewDto) {
    return request({
        url: '/interviews',
        method: 'post',
        data
    })
}

// 更新前端宝典
export function updateInterview(id: number, data: UpdateInterviewDto) {
    return request({
        url: `/interviews/${id}`,
        method: 'patch',
        data
    })
}

// 删除前端宝典
export function deleteInterview(id: number) {
    return request({
        url: `/interviews/${id}`,
        method: 'delete'
    })
}

// 收藏前端宝典
export function favoriteInterview(id: number) {
    return request({
        url: `/favorite/interview/${id}`,
        method: 'post'
    })
}
// 点赞前端宝典
export function likeInterview(id: number) {
    return request({
        url: `/like/interview/${id}`,
        method: 'post'
    })
} 