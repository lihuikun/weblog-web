import request from '@/utils/request';

// 消息类型接口
export interface MessageItem {
    id: string
    title: string
    content: string
    createdAt: string
    isRead: boolean
    redirectUrl?: string
    type: 'system' | 'notification'
}

// 发布消息参数接口
export interface PublishMessageParams {
    content: string
    redirectUrl?: string
    type: 'system' | 'notification'
}

// 获取消息列表
export function getMessages(params: {
    page?: number;
    pageSize?: number;
    type?: 'system' | 'notification';
}) {
    return request({
        url: `/messages/${params.type}`,
        method: 'get',
        params
    });
}

// 标记消息为已读
export function readMessage(id: string) {
    return request({
        url: `/messages/read/${id}`,
        method: 'patch'
    });
}

// 标记所有消息为已读
export function readAllMessages(params?: { type?: 'system' | 'notification' }) {
    return request({
        url: '/messages/read-all',
        method: 'put',
        params
    });
}

// 删除消息
export function deleteMessage(id: string) {
    return request({
        url: `/messages/${id}`,
        method: 'delete'
    });
}

// 获取未读消息数量
export function getUnreadCount() {
    return request({
        url: '/messages/unread-count',
        method: 'get'
    });
}

// 发布消息
export function publishMessage(data: PublishMessageParams) {
    return request({
        url: '/messages',
        method: 'post',
        data
    });
} 