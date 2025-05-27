// useVisibilityPolling.ts
import { useDocumentVisibility, useIntervalFn, Fn } from '@vueuse/core'
import { watch, onScopeDispose } from 'vue'

export function useVisibilityPolling(fn: Fn, interval = 5000, immediate = false) {
    const visibility = useDocumentVisibility()
    const { pause, resume, isActive } = useIntervalFn(fn, interval, { immediate })

    watch(visibility, (state) => {
        if (state === 'visible') {
            console.log('[useVisibilityPolling] 📢 页面可见，恢复轮询')
            resume()
        } else {
            console.log('[useVisibilityPolling] 🔇 页面不可见，暂停轮询')
            pause()
        }
    })

    // 👇 组件销毁时自动清理定时器
    onScopeDispose(() => {
        console.log('[useVisibilityPolling] 🧹 销毁定时器')
        pause()
    })

    return {
        pause,
        resume,
        isActive,
        visibility,
    }
}
