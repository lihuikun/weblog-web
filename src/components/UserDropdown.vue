<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Dropdown as ADropdown, Menu as AMenu, Avatar as AAvatar, Divider as AMenuDivider, message } from 'ant-design-vue'
import { useUserStore } from '@/stores/userStore'

const AMenuItem = AMenu.Item

const props = defineProps<{
    avatarUrl?: string // 头像URL
    username?: string // 用户名
    userFirstLetter?: string // 用户首字母
    size?: number // 头像大小
    homeButton?: boolean // 使用"回到首页"而非"退出登录"按钮
}>()

const emit = defineEmits<{
    (e: 'logout'): void
    (e: 'goHome'): void
}>()

const size = props.size || 36 // 默认大小
const router = useRouter()
const userStore = useUserStore()

// 前往管理页面（仅管理员可见）
const goToAdmin = () => {
    router.push('/admin/user-manage')
}

// 前往首页
const goHome = () => {
    router.push('/')
}

// 判断是否有管理员角色
const isAdmin = computed(() => {
    return userStore.roles.includes('admin')
})

// 退出登录方法
const handleLogout = async () => {
    try {
        userStore.setToken('');
        message.success('退出登录成功');
        router.push('/login');
    } catch (error: any) {
        message.error(error.message || '退出失败');
    }
};

// 基于属性决定在菜单底部显示哪种按钮
const showHomeButton = computed(() => !!props.homeButton)
</script>

<template>
    <ADropdown>
        <div class="flex items-center cursor-pointer">
            <AAvatar v-if="avatarUrl" :src="avatarUrl" :size="size" />
            <AAvatar v-else :size="size" :style="{ backgroundColor: '#1890ff' }">
                {{ userFirstLetter }}
            </AAvatar>
        </div>
        <template #overlay>
            <AMenu>
                <AMenuItem key="1">我的主页</AMenuItem>
                <AMenuItem key="2">我的收藏</AMenuItem>
                <AMenuItem key="3">我的设置</AMenuItem>
                <!-- 仅在非管理页面显示管理入口 -->
                <AMenuItem v-if="isAdmin && !showHomeButton" key="admin" @click="goToAdmin">后台管理</AMenuItem>
                <!-- 根据模式显示不同的按钮 -->
                <AMenuItem v-if="showHomeButton" key="home" @click="goHome">回到首页</AMenuItem>
                <hr />
                <AMenuItem key="logout" @click="handleLogout">退出登录</AMenuItem>
            </AMenu>
        </template>
    </ADropdown>
</template>