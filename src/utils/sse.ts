import { useUserStore } from '@/stores/userStore'

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

/**
 * 通用SSE流式请求工具
 * @param options SSE配置选项
 * @returns 返回可以取消流的控制器
 */
export async function createSSEStream(options: SSEOptions): Promise<SSEController> {
    const { url, method = 'POST', data, onMessage, onComplete, onError } = options

    try {
        // 使用useUserStore来获取token
        const userStore = useUserStore()

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'text/event-stream',
            'Cache-Control': 'no-cache',
        }

        // 如果有token，则添加Authorization头
        if (userStore.token) {
            headers.Authorization = `Bearer ${userStore.token}`
        }

        const fetchOptions: RequestInit = {
            method,
            headers,
        }

        // 如果是POST请求且有数据，添加请求体
        if (method === 'POST' && data) {
            fetchOptions.body = JSON.stringify(data)
        }

        const response = await fetch(url, fetchOptions)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body?.getReader()
        if (!reader) {
            throw new Error('ReadableStream not supported')
        }

        const decoder = new TextDecoder()
        let buffer = ''

        // 创建一个可以取消的Promise
        const readStream = async () => {
            try {
                while (true) {
                    const { done, value } = await reader.read()

                    if (done) {
                        onComplete()
                        break
                    }

                    // 解码数据块
                    buffer += decoder.decode(value, { stream: true })

                    // 处理SSE数据格式
                    const lines = buffer.split('\n')
                    buffer = lines.pop() || '' // 保留最后一个不完整的行

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6) // 移除 'data: ' 前缀

                            // 检查是否完成
                            if (data.trim() === '[DONE]') {
                                onComplete()
                                return
                            }

                            try {
                                // 尝试解析JSON格式的数据
                                const parsed = JSON.parse(data)
                                if (parsed.content) {
                                    onMessage(parsed.content)
                                }
                            } catch (parseError) {
                                // 如果不是JSON格式，直接作为内容处理
                                if (data.trim()) {
                                    onMessage(data)
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                onError(error)
            } finally {
                reader.releaseLock()
            }
        }

        readStream()

        // 返回一个可以取消流的函数
        return {
            cancel: () => {
                reader.cancel()
                reader.releaseLock()
            }
        }

    } catch (error) {
        onError(error)
        return {
            cancel: () => { }
        }
    }
} 