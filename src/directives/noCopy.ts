import type { App, Directive } from 'vue'

const COPY_BLOCKED_TEXT = '「前端宝典」内容仅面向 VIP 用户开放，复制传播请先征得授权，谢谢你的理解与支持💗'

const noCopy: Directive = {
    mounted(el: HTMLElement) {
        el.style.userSelect = 'text' // ✅ 允许选中

        const userStr = localStorage.getItem('user')
        const role = (() => {
            try {
                const user = JSON.parse(userStr || '{}')
                return user?.userInfo?.roles || ''
            } catch (e) {
                return ''
            }
        })()

        const isAdmin = role === 'admin'

        const copyHandler = (e: ClipboardEvent) => {
            if (!isAdmin) {
                e.preventDefault()
                e.clipboardData?.setData('text/plain', COPY_BLOCKED_TEXT)
            }
        }

        const contextMenuHandler = (e: Event) => {
            if (!isAdmin) e.preventDefault()
        }

        el.__noCopyHandlers = {
            copy: copyHandler as (e: Event) => void,
            contextmenu: contextMenuHandler
        }

        el.addEventListener('copy', copyHandler)
        el.addEventListener('contextmenu', contextMenuHandler)
    },

    unmounted(el: HTMLElement) {
        const handlers = el.__noCopyHandlers
        if (handlers) {
            el.removeEventListener('copy', handlers.copy)
            el.removeEventListener('contextmenu', handlers.contextmenu)
        }
        delete el.__noCopyHandlers
    }
}

export function setupNoCopyDirective(app: App) {
    app.directive('noCopy', noCopy)
}

// 👇TS 补全：扩展 HTMLElement 类型
declare global {
    interface HTMLElement {
        __noCopyHandlers?: Record<string, (e: Event) => void>
    }
}
