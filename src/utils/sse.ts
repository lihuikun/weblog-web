import { useUserStore } from '@/stores/userStore'
import { decryptData } from '@/utils/decrypt'
export interface SSEOptions {
    url: string
    method?: 'GET' | 'POST'
    data?: any
    onMessage: (content: string) => void
    onComplete: () => void
    onError: (error: any) => void
}

export interface SSEController {
    cancel: () => void
}
const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY
/**
 * 通用SSE流式请求工具
 * @param options SSE配置选项
 * @returns 返回可以取消流的控制器
 */
export async function createSSEStream(options: SSEOptions): Promise<SSEController> {
    const { url, method = 'GET', data, onMessage, onComplete, onError } = options

    try {
        // 使用useUserStore来获取token
        const userStore = useUserStore()

        // 构建请求 URL，并添加 token 作为参数
        const urlObj = new URL(url, window.location.origin)

        // 添加 token 到 URL 参数（NestJS SSE 会使用这个进行身份验证）
        if (userStore.token) {
            urlObj.searchParams.append('token', userStore.token)
        }

        // 如果有 data 参数，添加到 URL 中
        if (data) {
            Object.entries(data).forEach(([key, value]) => {
                urlObj.searchParams.append(key, String(value))
            })
        }

        // 创建 EventSource 实例
        const eventSource = new EventSource(urlObj.toString())

        // 处理接收到的消息
        eventSource.onmessage = (event) => {
            try {
                const parsedData = JSON.parse(event.data)
                console.log("🚀 ~ eventSource.onmessage ~ parsedData:", parsedData)

                // 处理完成信号
                if (parsedData.data.done) {
                    onComplete()
                    eventSource.close()
                    return
                }

                // 处理错误信号
                if (parsedData.data.error) {
                    onError(new Error(parsedData.error))
                    eventSource.close()
                    return
                }

                // 处理内容
                if (parsedData.data.content) {
                    onMessage(parsedData.data.content)
                }
            } catch (error) {
                // 处理非 JSON 格式或其他解析错误
                if (event.data && event.data !== '[DONE]') {
                    onMessage(event.data)
                }

                // 处理结束标志
                if (event.data === '[DONE]') {
                    onComplete()
                    eventSource.close()
                }
            }
        }

        // 处理错误
        eventSource.onerror = (error) => {
            console.error('SSE 连接错误:', error)
            onError(error)
            eventSource.close()
        }

        // 返回控制器
        return {
            cancel: () => {
                eventSource.close()
            }
        }
    } catch (error) {
        onError(error)
        return {
            cancel: () => { }
        }
    }
} 