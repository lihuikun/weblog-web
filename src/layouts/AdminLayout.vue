<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { message } from 'ant-design-vue';
import logo from '@/assets/logo.jpg';
import UserDropdown from '@/components/UserDropdown.vue';

const router = useRouter();
const userStore = useUserStore();
const route = useRoute();

const menuItems = [
    { key: 'user', label: '用户管理', path: '/admin/user' },
    // 可扩展更多后台菜单
];

const selectedKeys = ref<string[]>([menuItems[0].key]);

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
                <span class="ml-4 text-xl font-bold text-white">后台管理</span>
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
            <div class="flex flex-col px-2 py-6 w-56 bg-white border-r">
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

<style scoped></style>