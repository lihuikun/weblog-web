<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DreamHall from '@/components/dream/DreamHall.vue'
import MyDream from '@/components/dream/MyDream.vue'
import { Menu } from '@/router/index'

const route = useRoute()
const router = useRouter()
const activeView = ref('dream-hall')
const { sideMenuId } = defineProps<{ sideMenuId: string[] }>();
// 监听路由变化
watchEffect(() => {
    console.log('111', sideMenuId)
    if (sideMenuId) {
        activeView.value = sideMenuId[0]
    }
})

// 菜单项点击处理
const handleMenuClick = (key: string) => {
    activeView.value = key
    router.push({
        path: route.path,
        query: { view: key }
    })
}

onMounted(() => {
    console.log("当前活动视图:", activeView.value)
})
</script>

<template>
    <div class="flex flex-col h-full dream-container">
        <!-- 移动端菜单 -->
        <div class="dream-tabs">
            <div v-for="item in (route.meta.menu as Menu[])" :key="item.key"
                :class="['dream-tab', activeView === item.key ? 'active' : '']" @click="handleMenuClick(item.key)">
                {{ item.label }}
            </div>
        </div>

        <!-- 视图内容 -->
        <div v-if="activeView === 'dream-hall'" class="flex-1 h-full">
            <DreamHall />
        </div>
        <div v-else-if="activeView === 'my-dream'" class="flex-1 h-full">
            <MyDream />
        </div>
    </div>
</template>

<style scoped>
.dream-container {
    width: 100%;
    height: 100%;
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