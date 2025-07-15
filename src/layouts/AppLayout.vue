<script setup lang="ts">
import { ref, computed, watchEffect, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { BellOutlined, CaretDownOutlined } from '@ant-design/icons-vue';
import { theme, message } from 'ant-design-vue';
import { useThemeStore } from '@/stores/themeStore';
import moonIcon from '@/assets/icons/moon.png'
import sunIcon from '@/assets/icons/sun.png'
import { Menu } from '@/router/index';
import { getPV, PV } from '@/api/pv';
import logo from '@/assets/logo.jpg';
import { logout } from '@/api/auth';
import { getUnreadCount } from '@/api/message';
import { useUserStore } from '@/stores/userStore';
import UserDropdown from '@/components/UserDropdown.vue';
import { useDocumentVisibility, useIntervalFn } from '@vueuse/core'
import { useVisibilityPolling } from '@/hooks/useVisibilityPolling';
const themeStore = useThemeStore();
const userStore = useUserStore();
const router = useRouter();

const themeConfig = computed(() => ({
    algorithm: themeStore.isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
}));

const toggleTheme = () => {
    themeStore.toggleTheme();
};

watchEffect(() => {
    if (themeStore.isDark) {
        document.documentElement.classList.add('dark')
    } else {
        document.documentElement.classList.remove('dark')
    }
})

// 控制移动端菜单显示
const mobileMenuOpen = ref(false);

// 切换移动端菜单
const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};

// 当前选中的菜单项
const selectedKeys = ref<string[]>([]);

// 拿到路由的侧边栏
const route = useRoute()
const sideMenuId = ref<string[]>(
    route.meta.menu && Array.isArray(route.meta.menu) && route.meta.menu.length > 0
        ? [route.meta.menu[0].key]
        : []
)

// 导航菜单项
const navItems = [
    { key: 'interview', label: '前端宝典', path: '/', isNew: true },
    { key: 'hot-search', label: '热搜榜', path: '/hot-search' },
    { key: 'game', label: '摸鱼小游戏', path: '/game' },
    { key: 'dream', label: '集梦盒子', path: '/dream' },
    { key: 'daily-quote', label: '每日一句', path: '/daily-quote' },
    { key: 'link', label: '友情链接', path: '/link' },
];


const sideMenuItems = computed(() => {
    if (!route.meta.menu) return
    // sideMenuId.value = [(route.meta.menu as { key: string }[])?.[0].key]
    console.log("🚀 ~ sideMenuItems ~ sideMenuId.value:", sideMenuId.value, route.meta.menu)
    return route.meta.menu || []
})

const PVTotal = ref<PV>({
    todayPv: 0,
    totalPv: 0,
})

async function getPVTotal() {
    const { data } = await getPV()
    PVTotal.value = data as PV
}
const contentRef = ref<HTMLElement | null>(null)
watch(route, () => {
    const currentPath = route.path;
    const matchedItem = navItems.find(item => item.path === currentPath);

    if (matchedItem) {
        selectedKeys.value = [matchedItem.key];
        sideMenuId.value = [(route.meta.menu as { key: string }[])?.[0].key]
    } else {
        selectedKeys.value = ['home']; // 默认选中首页
    }
    // 内容容器滚动到顶部
    contentRef.value?.scrollTo(0, 0)
});

// 获取当前年
const year = new Date().getFullYear()

// 获取用户信息
const userInfo = computed(() => userStore.userInfo || { nickname: '', avatarUrl: '' });
const avatarUrl = computed(() => userInfo.value?.avatarUrl || '');
const username = computed(() => userInfo.value?.nickname || 'U');
const userFirstLetter = computed(() => {
    if (!username.value) return 'U';
    return username.value.charAt(0).toUpperCase();
});

// 添加登录状态判断
const isLoggedIn = computed(() => {
    return !!userStore.token;
});

function handleMenuClick(key: string) {
    console.log("🚀 ~ handleMenuClick ~ key:", key, contentRef.value)
    // 内容容器滚动到顶部
    contentRef.value?.scrollTo({ top: 0, behavior: 'smooth' });
}
function handleMessage() {
    router.push('/message')
}

// 添加未读消息数量
const unreadCount = ref(0);
let pollingTimer: number | null = null;

// 获取未读消息数量
const fetchUnreadCount = async () => {
    if (!isLoggedIn.value) {
        unreadCount.value = 0;
        return;
    }

    try {
        const res = await getUnreadCount();
        unreadCount.value = res.data || 0;
        console.log('请求接口了')
    } catch (error) {
        console.error('获取未读消息数量失败', error);
    }
};
const { isActive } = useVisibilityPolling(fetchUnreadCount, 5000, true)


// 组件挂载时启动轮询，卸载时停止轮询
onMounted(() => {
    getPVTotal();
});
watch(isActive, () => {
    console.log('isActive', isActive)
})
</script>

<template>
    <a-config-provider :theme="themeConfig">
        <div class="flex flex-col min-h-screen bg-gray-50">
            <!-- 顶部导航栏 -->
            <a-layout-header class="sticky top-0 z-50 p-0 h-auto bg-white shadow-sm">
                <!-- 大屏幕导航 -->
                <div class="container hidden justify-between items-center px-4 mx-auto h-16 md:flex">
                    <div class="flex items-center space-x-8">
                        <!-- Logo -->
                        <router-link to="/" class="flex items-center">
                            <a-avatar shape="square" :size="32" class="flex justify-center items-center">
                                <template #icon>
                                    <img src="@/assets/logo.jpg" alt="">
                                </template>
                            </a-avatar>
                            <span class="ml-4 text-xl font-bold text-white">前端的日常</span>
                        </router-link>

                        <!-- 主导航 -->
                        <a-menu mode="horizontal" v-model:selectedKeys="selectedKeys" class="bg-transparent border-0">
                            <a-menu-item v-for="item in navItems" :key="item.key">
                                <router-link :to="item.path">
                                    <span>{{ item.label }}</span>
                                    <!-- <a-badge v-if="item.isNew" dot class="absolute -top-1 -right-1 ml-1"
                                        color="#f5222d" /> -->
                                </router-link>
                            </a-menu-item>
                        </a-menu>
                    </div>

                    <!-- 搜索框和用户区域 -->
                    <div class="flex items-center space-x-4">
                        <!-- 通知图标只在登录后显示 -->
                        <template v-if="isLoggedIn">
                            <a-badge :count="unreadCount" @click="handleMessage">
                                <a-button type="text" shape="circle">
                                    <template #icon>
                                        <BellOutlined />
                                    </template>
                                </a-button>
                            </a-badge>
                        </template>

                        <!-- 主题切换按钮 -->
                        <div @click="toggleTheme">
                            <img width="20" :src="themeStore.isDark ? moonIcon : sunIcon" alt="theme icon" />
                        </div>

                        <!-- 根据登录状态显示不同的内容 -->
                        <template v-if="isLoggedIn">
                            <UserDropdown :avatarUrl="avatarUrl" :username="username"
                                :userFirstLetter="userFirstLetter" />
                        </template>
                        <template v-else>
                            <div class="space-x-2">
                                <router-link to="/login">
                                    <a-button type="primary">登录</a-button>
                                </router-link>
                                <router-link to="/login?type=register">
                                    <a-button>注册</a-button>
                                </router-link>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- 移动端导航 -->
                <div class="flex justify-between items-center px-4 h-14 md:hidden">
                    <!-- Logo和下拉菜单 -->
                    <a-dropdown>
                        <div class="flex items-center">
                            <a-avatar shape="square" :size="28" class="flex justify-center items-center bg-blue-500">
                                <template #icon>
                                    <img :src="logo" alt="">
                                </template>
                            </a-avatar>
                            <span class="ml-3 text-lg font-bold text-white">首页</span>
                            <CaretDownOutlined class="ml-1 text-white" />
                        </div>

                        <template #overlay>
                            <a-menu>
                                <a-menu-item v-for="item in navItems" :key="item.key">
                                    <router-link :to="item.path">{{ item.label }}</router-link>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>

                    <!-- 用户头像 -->
                    <div class="flex gap-3 items-center">
                        <div @click="toggleTheme">
                            <img width="20" :src="themeStore.isDark ? moonIcon : sunIcon" alt="theme icon" />
                        </div>
                        <template v-if="isLoggedIn">
                            <a-badge :count="unreadCount" @click="handleMessage">
                                <a-button type="text" shape="circle" size="small">
                                    <template #icon>
                                        <BellOutlined />
                                    </template>
                                </a-button>
                            </a-badge>

                            <UserDropdown :avatarUrl="avatarUrl" :username="username"
                                :userFirstLetter="userFirstLetter" />
                        </template>
                        <template v-else>
                            <div class="space-x-2">
                                <router-link to="/login">
                                    <a-button type="primary" size="small">登录</a-button>
                                </router-link>
                                <router-link to="/login?type=register">
                                    <a-button size="small">注册</a-button>
                                </router-link>
                            </div>
                        </template>
                    </div>
                </div>

                <!-- 移动端二级导航 -->
                <div class="overflow-x-auto px-4 py-2 whitespace-nowrap border-t border-gray-100 md:hidden">
                    <a-radio-group v-model:value="sideMenuId[0]" button-style="solid" size="small">
                        <a-radio-button v-for="item in (sideMenuItems as Menu[])" :key="item.key" :value="item.key">
                            {{ item.label }}
                        </a-radio-button>
                    </a-radio-group>
                </div>
            </a-layout-header>

            <!-- 主内容区 -->
            <a-layout class="container md:px-4 py-6 mx-auto bg-transparent">
                <a-layout class="bg-transparent">
                    <!-- 左侧边栏 - 仅在大屏幕显示 -->
                    <a-layout-sider v-if="sideMenuItems && (sideMenuItems as Menu[])?.length !== 0"
                        class="hidden bg-transparent md:block" width="200" :style="{ background: 'transparent' }"
                        breakpoint="lg" collapsed-width="0">
                        <a-menu mode="inline" v-model:selectedKeys="sideMenuId" class="bg-white rounded-lg shadow-sm"
                            style="height: 100%" @click="handleMenuClick">
                            <a-menu-item v-for="item in (sideMenuItems as Menu[])" :key="item.key">
                                <template #icon>
                                    <a-icon>
                                        <component :is="item.icon" />
                                    </a-icon>
                                </template>
                                <span>{{ item.label }}</span>
                            </a-menu-item>
                        </a-menu>
                    </a-layout-sider>

                    <!-- 内容区域 -->
                    <div ref="contentRef"
                        class="overflow-y-auto md:px-6 h-[calc(100vh-120px)] bg-white xs:px-0 scrollbar-hide flex-1 shadow-lg md:ml-[10px] rounded-lg">
                        <slot :sideMenuId="sideMenuId" />
                    </div>
                </a-layout>
            </a-layout>
        </div>
    </a-config-provider>
</template>

<style scoped>
/* 自定义样式 */
:deep(.ant-menu-horizontal) {
    border-bottom: none;
    line-height: 46px;
}

:deep(.ant-layout-header) {
    line-height: 1.5;
}

:deep(.ant-menu-item),
:deep(.ant-menu-submenu) {
    padding: 0 12px;
}

/* 移动端水平滚动菜单 */
:deep(.ant-radio-group) {
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 4px;
}

:deep(.ant-radio-button-wrapper) {
    margin-right: 8px;
}

/* 隐藏滚动条但保留功能 */
:deep(.ant-radio-group)::-webkit-scrollbar {
    display: none;
}

::v-deep(.ant-layout-sider-children) {
    height: auto;
}

:deep(.ant-card-body) {
    padding: 10px;
}

:deep(.clock) {
    :deep(.flip) {
        width: 30px;
        height: 40px;
    }
}
</style>