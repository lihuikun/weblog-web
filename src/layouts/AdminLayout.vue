<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { message } from 'ant-design-vue';
import logo from '@/assets/logo.jpg';
import UserDropdown from '@/components/UserDropdown.vue';
import adminRoutes from '@/router/admin-routes';

const router = useRouter();
const userStore = useUserStore();
const route = useRoute();

// 从路由配置中动态获取管理员菜单项
const menuItems = computed(() => {
    return adminRoutes.map(route => ({
        key: route.name as string,
        label: route.meta?.title as string,
        path: route.path
    }));
});

const selectedKeys = ref<string[]>([]);

// 根据当前路由设置选中的菜单项
watch(() => route.name, (newRouteName) => {
    if (newRouteName) {
        selectedKeys.value = [newRouteName as string];
    }
}, { immediate: true });

const handleMenuClick = (item: any) => {
    selectedKeys.value = [item.key];
    router.push(item.path);
};

const handleGoHome = () => {
    router.push('/');
};

const userInfo = computed(() => userStore.userInfo || { nickname: '', avatarUrl: '' });
const avatarUrl = computed(() => userInfo.value?.avatarUrl || '');
const username = computed(() => userInfo.value?.nickname || 'U');
const userFirstLetter = computed(() => {
    if (!username.value) return 'U';
    return username.value.charAt(0).toUpperCase();
});
</script>

<template>
    <div class="flex flex-col min-h-screen bg-gray-50">
        <!-- 顶部 -->
        <div class="flex justify-between items-center px-8 h-16 bg-white shadow">
            <div class="flex gap-3 items-center">
                <img :src="logo" class="w-10 h-10 rounded" />
                <span class="ml-4 text-xl font-bold text-white">管理后台</span>
            </div>
            <div class="flex gap-4 items-center">
                <span class="font-medium">{{ username }}</span>
                <UserDropdown :avatarUrl="avatarUrl" :username="username" :userFirstLetter="userFirstLetter"
                    :homeButton="true" @goHome="handleGoHome" />
            </div>
        </div>
        <!-- 主体 -->
        <div class="flex flex-1 min-h-0">
            <!-- 左侧菜单栏 -->
            <div class="flex flex-col px-2 py-6 w-56 bg-white border-r-0">
                <AMenu mode="inline" :selectedKeys="selectedKeys">
                    <AMenuItem v-for="item in menuItems" :key="item.key" @click="() => handleMenuClick(item)">
                        {{ item.label }}
                    </AMenuItem>
                </AMenu>
            </div>
            <!-- 右侧内容区 -->
            <div class="overflow-auto flex-1 p-6 min-w-0">
                <router-view />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
/* 移除菜单栏右边框 */
.ant-menu-inline {
    border-right: none !important;
}
</style>