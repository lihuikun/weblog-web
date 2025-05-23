import request from '@/utils/request'

// 消息类型
export interface Message {
    id: number
    title: string
    content: string
    type: 'system' | 'notification'
    isRead: boolean
    createdAt: string
    updateTime: string
    userId?: number
    sender?: {
        id: number
        nickname: string
        email: string
    }
}

// 分页参数
export interface PaginationParams {
    page: number
    pageSize: number
}

// 获取所有消息参数
export interface GetAllMessagesParams extends PaginationParams {
    type?: string
}

// 更新消息参数
export interface UpdateMessageDto {
    title?: string
    content?: string
    type?: 'system' | 'notification'
    isRead?: boolean
}

// 获取所有消息（管理后台）
export function getAllMessages(params: GetAllMessagesParams) {
    return request.get('/messages/all', { params })
}

// 更新消息（管理后台）
export function updateMessage(messageId: number, data: UpdateMessageDto) {
    return request.patch(`/messages/${messageId}`, data)
}

// 删除消息（管理后台）
export function deleteMessage(messageId: number) {
    return request.delete(`/messages/${messageId}`)
}

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