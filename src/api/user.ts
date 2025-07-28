import request from '@/utils/request'

export function getUserList(params: { page: number; pageSize: number; keyword?: string }) {
    return request({ url: '/user/list', method: 'get', params })
}
export function deleteUser(id: number) {
    return request({ url: `/user/${id}`, method: 'delete' })
}
export function updateUserPartial(id: any, data: any) {
    return request({ url: `/user/${id}`, method: 'put', data })
}
// 获取个人信息
export function getUserProfile() {
    return request({
        url: '/user/profile',
        method: 'get'
    })
} 