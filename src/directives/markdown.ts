import type { Directive } from 'vue'

const removeMarkdown = (text: string) => {
    return text
        .replace(/#+\s/g, '') // 移除标题符号
        .replace(/\*\*(.*?)\*\*/g, '$1') // 移除加粗
        .replace(/\*(.*?)\*/g, '$1') // 移除斜体
        .replace(/\[(.*?)\]\(.*?\)/g, '$1') // 移除链接，保留文本
        .replace(/`(.*?)`/g, '$1') // 移除代码块
        .replace(/~~(.*?)~~/g, '$1') // 移除删除线
        .replace(/>\s(.*)/g, '$1') // 移除引用
        .replace(/\n/g, ' ') // 将换行转换为空格
        .replace(/\s+/g, ' ') // 多个空格转换为单个空格
        .trim() // 移除首尾空格
}

export const vMarkdown: Directive = {
    mounted(el, binding) {
        const originalText = binding.value || el.textContent
        el.setAttribute('title', originalText) // 保存原始文本到title属性
        el.textContent = removeMarkdown(originalText)
    },
    updated(el, binding) {
        const originalText = binding.value || el.textContent
        el.setAttribute('title', originalText)
        el.textContent = removeMarkdown(originalText)
    }
} 