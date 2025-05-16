import { post } from '@/utils/request-old'

export const addPic = (data: any): Promise<any> => {
    return post('/gitee/upload', data)
}