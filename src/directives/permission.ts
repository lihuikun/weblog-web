import type { App, Directive, DirectiveBinding } from 'vue'
import { useUserStore } from '@/stores/userStore'

/**
 * 权限指令
 * 用法:
 * - v-permission="'admin'" - 只有admin角色可见
 * - v-permission="['admin', 'editor']" - 拥有admin或editor任一角色可见
 * - v-permission.and="['admin', 'editor']" - 必须同时拥有admin和editor角色才可见
 */

// 检查用户是否有权限
function hasPermission(requiredRoles: string | string[], mode: 'or' | 'and' = 'or'): boolean {
    if (!requiredRoles || !(requiredRoles as string[]).length) {
        return true
    }

    const userStore = useUserStore()
    console.log("🚀 ~ hasPermission ~ userStore:", userStore.isLoggedIn)

    if (!userStore.isLoggedIn) {
        return false
    }

    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]

    if (roles.length === 0) {
        return true
    }

    if (mode === 'and') {
        // 必须拥有所有指定角色
        return userStore.hasAllRoles(roles)
    } else {
        // 拥有任一角色即可
        return userStore.hasAnyRole(roles)
    }
}

const permissionDirective: Directive = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        const { value, modifiers } = binding
        console.log("🚀 ~ mounted ~ binding:", binding)
        const mode = modifiers.and ? 'and' : 'or'

        if (!hasPermission(value, mode)) {
            // 无权限时移除元素
            el.parentNode?.removeChild(el)
        }
    },
    updated(el: HTMLElement, binding: DirectiveBinding) {
        const { value, modifiers } = binding
        const mode = modifiers.and ? 'and' : 'or'

        const show = hasPermission(value, mode)
        console.log("🚀 ~ updated ~ show:", show)

        if (!show && el.parentNode) {
            el.parentNode.removeChild(el)
        }
    }
}

export function setupPermissionDirective(app: App) {
    app.directive('permission', permissionDirective)
}

export default permissionDirective 