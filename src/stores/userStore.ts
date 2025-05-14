import { defineStore } from 'pinia'

interface UserState {
    token: string | null
    userInfo: {
        id?: string
        username?: string
        avatar?: string
        roles: string[]
        [key: string]: any
    } | null
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        token: null,
        userInfo: null
    }),

    getters: {
        isLoggedIn: (state) => !!state.token,
        roles: (state) => state.userInfo?.roles || [],

        // 检查是否有特定角色
        hasRole: (state) => (role: string) => {
            return state.userInfo?.roles?.includes(role) || false
        },

        // 检查是否有多个角色中的任意一个
        hasAnyRole: (state) => (roles: string[]) => {
            return roles.some(role => state.userInfo?.roles?.includes(role)) || false
        },

        // 检查是否同时具有所有角色
        hasAllRoles: (state) => (roles: string[]) => {
            return roles.every(role => state.userInfo?.roles?.includes(role))
        }
    },

    actions: {
        // 设置用户信息
        setUserInfo(userInfo: any) {
            this.userInfo = userInfo
        },

        // 设置token
        setToken(token: string) {
            this.token = token
        },

        // 设置角色
        setRoles(roles: string[]) {
            if (!this.userInfo) {
                this.userInfo = { roles: [] }
            }
            this.userInfo.roles = roles
        },

        // 登出
        logout() {
            this.token = null
            this.userInfo = null
        }
    },

    persist: true
}) 