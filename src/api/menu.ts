import request from '@/utils/request'

export function getSquareMenuList(params: { page?: number; pageSize?: number; keyword?: string; squareCategoryId?: number; includeHidden?: boolean }) {
    return request({ url: '/menu/square', method: 'get', params })
}
export function updateSquareMenuCategory(id: number, data: { squareCategoryId: number }) {
    return request({ url: `/menu/square/${id}/category`, method: 'put', data })
}
export function updateSquareMenuHidden(id: number, data: { hidden: boolean }) {
    return request({ url: `/menu/square/${id}/hidden`, method: 'put', data })
}
export function deleteSquareMenu(id: number) {
    return request({ url: `/menu/square/${id}`, method: 'delete' })
}
