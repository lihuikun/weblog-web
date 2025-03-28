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
      menu: [
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
    path: '/game',
    name: 'game',
    component: () => import('@/views/Game.vue'),
    meta: {
      title: '摸鱼小游戏',
      keepAlive: true,
      menu: [
        { key: 'jump', label: '跳一跳', url: 'https://haiyong.site/moyu/tyt/' },
        { key: 'car', label: '汽车', url: 'https://haiyong.site/moyu/slowroads/' },
        { key: 'sanguo', label: '三国志', url: 'https://fc.haiyong.site/games/%E4%B8%89%E5%9B%BD%E5%BF%97%20-%20%E4%B8%AD%E5%8E%9F%E4%B9%8B%E9%9C%B8%E8%80%85(%E7%AE%80)[%E8%B0%88%E9%AD%88%E7%96%AF%E7%94%9F](JP)[SLG](3Mb)/' },
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