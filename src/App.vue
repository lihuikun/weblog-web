<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { BellOutlined, CaretDownOutlined } from '@ant-design/icons-vue';
import { theme } from 'ant-design-vue';
import { useThemeStore } from '@/stores/themeStore';
import moonIcon from '@/assets/icons/moon.png'
import sunIcon from '@/assets/icons/sun.png'
import { Menu } from '@/router/index';
import { getPV, PV } from '@/api/pv';
const themeStore = useThemeStore();

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
const selectedKeys = ref([]);

const sideMenuId = ref(['new'])

// 导航菜单项
const navItems = [
  { key: 'home', label: '首页', path: '/' },
  { key: 'hot-search', label: '热搜榜', path: '/hot-search' },
  { key: 'game', label: '摸鱼小游戏', path: '/game' },
  // { key: 'course', label: '课程', path: '/course' },
  // { key: 'live', label: '直播', path: '/live' },
  // { key: 'activity', label: '活动', path: '/activity' },
  // { key: 'ai', label: 'AI掘金', path: '/ai', isNew: true },
  // { key: 'mall', label: '商城', path: '/mall' },
  // { key: 'app', label: 'APP', path: '/app' },
  // { key: 'extension', label: '插件', path: '/extension' }
];

// 拿到路由的侧边栏
const route = useRoute()

const sideMenuItems = computed(() => {
  if (!route.meta.menu) return
  sideMenuId.value = [(route.meta.menu as { key: string }[])?.[0].key]
  return route.meta.menu || []
})
const PVTotal = ref<PV>({
  todayPv: 0,
  totalPv: 0,
})
async function getPVTotal() {
  const { data } = await getPV()
  PVTotal.value = data
}
watch(route, () => {
  const currentPath = route.path;
  const matchedItem = navItems.find(item => item.path === currentPath);

  if (matchedItem) {
    selectedKeys.value = [matchedItem.key];
  } else {
    selectedKeys.value = ['home']; // 默认选中首页
  }
});
onMounted(() => {
  getPVTotal()
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
                  <a-badge v-if="item.isNew" dot class="absolute -top-1 -right-1 ml-1" color="#f5222d" />
                </router-link>
              </a-menu-item>
            </a-menu>
          </div>

          <!-- 搜索框和用户区域 -->
          <div class="flex items-center space-x-4">
            <!-- 搜索框 -->
            <!-- <a-input-search
              placeholder="探索"
              style="width: 250px"
              :bordered="true"
              class="rounded-lg"
            >
              <template #prefix>
                <SearchOutlined />
              </template>
            </a-input-search> -->

            <!-- 创作中心 -->
            <!-- <a-dropdown>
              <a-button type="primary" class="flex items-center">
                创作中心
                <a-icon class="ml-1">
                  <svg viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor">
                    <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
                  </svg>
                </a-icon>
              </a-button>
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">写文章</a-menu-item>
                  <a-menu-item key="2">发沸点</a-menu-item>
                  <a-menu-item key="3">写笔记</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown> -->

            <!-- 通知 -->
            <a-badge count="5">
              <a-button type="text" shape="circle">
                <template #icon>
                  <BellOutlined />
                </template>
              </a-button>
            </a-badge>
            <div @click="toggleTheme">
              <img width="20" :src="themeStore.isDark ? moonIcon : sunIcon" alt="theme icon" />
            </div>

            <!-- 用户头像 -->
            <a-dropdown>
              <a-avatar src="https://picsum.photos/200" :size="36" />
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">我的主页</a-menu-item>
                  <a-menu-item key="2">我的收藏</a-menu-item>
                  <a-menu-item key="3">我的设置</a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="4">退出登录</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
        </div>

        <!-- 移动端导航 -->
        <div class="flex justify-between items-center px-4 h-14 md:hidden">
          <!-- Logo和下拉菜单 -->
          <a-dropdown>
            <div class="flex items-center">
              <a-avatar shape="square" :size="28" class="flex justify-center items-center bg-blue-500">
                <template #icon>
                  <img src="@/assets/logo.jpg" alt="">
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

          <!-- 搜索框 -->
          <!-- <a-input-search
            placeholder="探索"
            class="flex-1 mx-2"
            :bordered="true"
            size="small"
          >
            <template #prefix>
              <SearchOutlined style="font-size: 14px" />
            </template>
          </a-input-search> -->

          <!-- 用户头像 -->
          <div class="flex gap-3 items-center">
            <div @click="toggleTheme">
              <img width="20" :src="themeStore.isDark ? moonIcon : sunIcon" alt="theme icon" />
            </div>
            <a-dropdown>
              <a-avatar src="https://picsum.photos/200" :size="28" />
              <template #overlay>
                <a-menu>
                  <a-menu-item key="1">我的主页</a-menu-item>
                  <a-menu-item key="2">我的收藏</a-menu-item>
                  <a-menu-item key="3">我的设置</a-menu-item>
                  <a-menu-divider />
                  <a-menu-item key="4">退出登录</a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
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
      <a-layout class="container px-4 py-6 mx-auto bg-transparent">
        <a-layout class="bg-transparent">
          <!-- 左侧边栏 - 仅在大屏幕显示 -->
          <a-layout-sider class="hidden bg-transparent md:block" width="200" :style="{ background: 'transparent' }"
            breakpoint="lg" collapsed-width="0">
            <a-menu mode="inline" v-model:selectedKeys="sideMenuId" class="bg-white rounded-lg shadow-sm"
              style="height: 100%">
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
          <a-layout-content class="px-6 bg-white xs:px-0">
            <router-view :sideMenuId="sideMenuId" />
          </a-layout-content>

          <!-- 右侧边栏 - 仅在大屏幕显示 -->
          <a-layout-sider class="hidden bg-transparent lg:block" width="300" :style="{ background: 'transparent' }">
            <div class="ml-6">
              <!-- 签到卡片 -->
              <a-card title="微信公众号：前端的日常" class="mb-4">
                <div class="font-bold">路过的大佬，麻烦关注一下,2025发大财</div>
                <div class="mt-2">
                  <img src="@/assets/qrcode.png" alt="">
                </div>
              </a-card>
              <a-card class="mb-4" title="前端日常开发分享">
                <div class="flex justify-between items-center">
                  有兴趣一起进步的小伙伴可以关注一下，沟通进步~
                </div>
                <div class="flex justify-between items-center">
                  不要让知识在收藏夹里面吃灰，一起出来讨论呀~
                </div>
                <iframe class="w-full h-[70px]" src="https://flip-clock.lihk.top" frameborder="0"></iframe>
              </a-card>
              <a-card title="网站PV" class="mb-4">
                <div class="flex">
                  <div class="flex flex-col flex-1 items-center">
                    <div class="font-bold">今日 PV</div>
                    <div>{{ PVTotal.todayPv }}</div>
                  </div>
                  <div class="flex flex-col flex-1 items-center">
                    <div class="font-bold">总 PV</div>
                    <div>{{ PVTotal.totalPv }}</div>
                  </div>
                </div>
              </a-card>
              <a-card title="微信小程序：前端的日常" class="mb-4">
                <div class="font-bold">路过的大佬，麻烦关注一下,2025发大财</div>
                <div class="mt-2">
                  <img src="@/assets/qrcode.bmp" alt="">
                </div>
              </a-card>
              <!-- 排行榜卡片 -->
              <!-- <a-card title="文章榜" class="mb-4">
                <a-list item-layout="horizontal" :data-source="[1, 2, 3, 4, 5]">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <div class="flex items-start">
                        <div class="mr-2 font-medium text-blue-500">{{ item }}</div>
                        <div class="flex-1">
                          <div class="font-medium">AI 插件第二弹，更强更好用</div>
                        </div>
                      </div>
                    </a-list-item>
                  </template>
                </a-list>
                <template #extra>
                  <a-button type="link">查看更多</a-button>
                </template>
              </a-card> -->

              <!-- 作者榜卡片 -->
              <!-- <a-card title="作者榜">
                <a-list item-layout="horizontal" :data-source="[1, 2, 3]">
                  <template #renderItem="{ item }">
                    <a-list-item>
                      <a-list-item-meta>
                        <template #avatar>
                          <a-avatar src="https://picsum.photos/200" />
                        </template>
                        <template #title>
                          <div>作者 {{ item }}</div>
                        </template>
                        <template #description>
                          <div class="text-gray-500">前端工程师</div>
                        </template>
                      </a-list-item-meta>
                      <template #extra>
                        <a-button size="small">关注</a-button>
                      </template>
                    </a-list-item>
                  </template>
                </a-list>
              </a-card> -->
            </div>
          </a-layout-sider>
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