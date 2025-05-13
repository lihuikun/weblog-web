<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DreamHall from '@/components/dream/DreamHall.vue'
import MyDream from '@/components/dream/MyDream.vue'
import { Menu } from '@/router/index'

const route = useRoute()
const router = useRouter()
const activeView = ref('dream-hall')

// 从侧边栏菜单 ID 中获取当前活动视图
const updateActiveView = () => {
    const menu = route.meta.menu as Menu[] || []
    const sideMenuId = route.query.view as string

    if (sideMenuId) {
        // 如果URL中有view参数，优先使用它
        activeView.value = sideMenuId
    } else if (menu.length > 0) {
        // 没有参数时使用第一个菜单项
        activeView.value = menu[0].key
    }
}

// 监听路由变化
watch(() => route.query.view, updateActiveView, { immediate: true })

// 菜单项点击处理
const handleMenuClick = (key: string) => {
    activeView.value = key
    router.push({
        path: route.path,
        query: { view: key }
    })
}

onMounted(() => {
    updateActiveView()
})
</script>

<template>
    <div class="dream-container">
        <!-- 移动端菜单 -->
        <div class="dream-tabs">
            <div v-for="item in (route.meta.menu as Menu[])" :key="item.key"
                :class="['dream-tab', activeView === item.key ? 'active' : '']" @click="handleMenuClick(item.key)">
                {{ item.label }}
            </div>
        </div>

        <!-- 视图内容 -->
        <div v-if="activeView === 'dream-hall'">
            <DreamHall />
        </div>
        <div v-else-if="activeView === 'my-dream'">
            <MyDream />
        </div>
    </div>
</template>

<style scoped>
.dream-container {
    width: 100%;
}

/* 移动端菜单 - 在大屏幕隐藏，因为有侧边栏 */
.dream-tabs {
    display: flex;
    gap: 4px;
    margin-bottom: 20px;
    background: #fff;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.dream-tab {
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s;
    font-weight: 500;
}

.dream-tab:hover {
    background: #f0f0f0;
}

.dream-tab.active {
    background: #1890ff;
    color: white;
}

/* 在大屏幕隐藏移动端菜单，使用侧边栏 */
@media (min-width: 768px) {
    .dream-tabs {
        display: none;
    }
}
</style>