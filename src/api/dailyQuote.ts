import request from '@/utils/request';

// 每日一句数据接口
export interface DailyQuote {
    id: string;
    content: string;
    author?: string;
    img: string;
    tts?: string;
    date: string;
    note?: string;
    translation?: string;
}

// 获取每日一句
export function getDailyQuote() {
    return request({
        url: '/daily-quote',
        method: 'get'
    });
} 