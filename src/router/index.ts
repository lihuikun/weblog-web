import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
export interface Menu {
  key: string;
  label: string;
  icon: string;
}
// 路由配置
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
      keepAlive: true,
      menu:[
        { key: '0', label: '最新文章', icon: 'user-outlined' },
        { key: '1', label: 'Vue', icon: 'appstore-outlined' },
        { key: '2', label: 'NestJs', icon: 'trophy-outlined' },
        { key: '3', label: '前端', icon: 'database-outlined' },
        { key: '4', label: '微信小程序', icon: 'code-outlined' },
        { key: '5', label: 'Node', icon: 'android-outlined' },
      ]
    },
  },
  {
    path: '/hot-search',
    name: 'hot-search',
    component: () => import('@/views/HotSearch.vue'),
    meta: {
      title: '热搜',
      keepAlive: true,
      menu: [
        { key: 'juejin', label: '稀土掘金', icon: 'user-outlined' },
        { key: 'toutiao', label: '今日头条', icon: 'appstore-outlined' },
        { key: 'weibo', label: '新浪微博', icon: 'trophy-outlined' },
        { key: 'douyin', label: '抖音', icon: 'trophy-outlined' },
      ]
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: '关于',
      keepAlive: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '404',
      keepAlive: true,
    },
  },
];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title as string || '默认标题'} - Vue3 App`;
  
  // 这里可以添加权限验证等逻辑
  // const token = localStorage.getItem('token');
  // if (to.meta.requiresAuth && !token) {
  //   next('/login');
  // } else {
  //   next();
  // }
  
  next();
});

export default router;