import type { UploadResponse, UploadOptions } from '@/types/upload'
import { env } from '@/config/env'

/**
 * 文件上传（自动处理路径 + Content-Type）
 * @param file 要上传的文件
 * @param options 上传选项
 * @returns Promise<UploadResponse>
 */
export async function uploadFile(
    file: File,
    options?: UploadOptions
): Promise<UploadResponse> {
    const { path, authKey } = options || {}

    // Worker 上传接口（注意：这里换成你的 Cloudflare Worker 地址）
    const baseUrl = env.R2_UPLOAD_URL || 'https://upload-web.lihk180.dpdns.org'

    // 拼接路径（可选）
    const uploadUrl = path
        ? `${baseUrl}/${encodeURIComponent(file.name)}?path=/${path}`
        : `${baseUrl}/${encodeURIComponent(file.name)}`

    const headers: Record<string, string> = {
        'Content-Type': file.type || 'application/octet-stream',
        'X-Custom-Auth-Key': authKey || env.R2_AUTH_KEY,
    }

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: file,
            headers,
        })

        if (!response.ok) {
            const err = await response.text()
            throw new Error(`上传失败: ${response.status} ${err}`)
        }

        const result = await response.json()
        console.log('result', result)
        return result
    } catch (error) {
        console.error('文件上传错误:', error)
        throw error
    }
}

/**
 * 通过 URL 参数指定路径的上传方式（备用）
 * @param file 要上传的文件
 * @param options 上传选项
 * @returns Promise<UploadResponse>
 */
export async function uploadFileWithUrlPath(
    file: File,
    options?: UploadOptions
): Promise<UploadResponse> {
    const { path, authKey } = options || {}
    const baseUrl = env.R2_UPLOAD_URL || 'https://upload-web.lihk180.dpdns.org'

    const url = new URL(`${baseUrl}/r2-upload`)
    if (path) url.searchParams.set('path', path)

    const headers: Record<string, string> = {
        'Content-Type': file.type || 'application/octet-stream',
        'X-Custom-Auth-Key': authKey || env.R2_AUTH_KEY,
    }

    try {
        const response = await fetch(url.toString(), {
            method: 'POST',
            body: file,
            headers,
        })

        if (!response.ok) {
            const err = await response.text()
            throw new Error(`上传失败: ${response.status} ${err}`)
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error('文件上传错误:', error)
        throw error
    }
}

/**
 * 删除文件（按 key 删除）
 * @param key 文件在存储桶中的 key
 * @param authKey 认证密钥
 * @returns Promise<boolean>
 */
export async function deleteFile(
    key: string,
    authKey?: string
): Promise<boolean> {
    const baseUrl = env.R2_UPLOAD_URL || 'https://upload-web.lihk180.dpdns.org'
    const headers: Record<string, string> = {
        'X-Custom-Auth-Key': authKey || env.R2_AUTH_KEY,
    }

    try {
        const response = await fetch(`${baseUrl}/${encodeURIComponent(key)}`, {
            method: 'DELETE',
            headers,
        })

        if (!response.ok) {
            const err = await response.text()
            console.error('文件删除失败:', err)
            return false
        }

        console.log(`🗑️ 文件已删除: ${key}`)
        return true
    } catch (error) {
        console.error('文件删除错误:', error)
        return false
    }
}
