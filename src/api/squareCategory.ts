import request from '@/utils/request'

export function getSquareCategoryList() {
    return request({ url: '/square-category', method: 'get' })
}
export function createSquareCategory(data: { name: string; description?: string; image?: string; sort?: number }) {
    return request({ url: '/square-category', method: 'post', data })
}
export function updateSquareCategory(id: number, data: { name?: string; description?: string; image?: string; sort?: number }) {
    return request({ url: `/square-category/${id}`, method: 'put', data })
}
export function deleteSquareCategory(id: number) {
    return request({ url: `/square-category/${id}`, method: 'delete' })
}
