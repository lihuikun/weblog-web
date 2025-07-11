import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import publicRoutes from './public-routes';
import adminRoutes from './admin-routes';
import { message } from 'ant-design-vue';
import { useUserStore } from '@/stores/userStore';
import { categoryOptions } from '@/api/constants';
export interface Menu {
  key: string;
  label: string;
  icon: string;
}

// 需要主布局的路由配置
const mainRoutes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Interview',
    component: () => import('@/views/Interview.vue'),
    meta: {
      title: '前端宝典',
      keepAlive: true,
      requiresAuth: false,
      layout: 'default',
      menu: [
        { key: 'all', label: '全部' },
        ...categoryOptions.map(item => ({ key: item.value.toString(), label: item.label }))
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
      requiresAuth: true,
      layout: 'default',
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
      requiresAuth: true,
      layout: 'default',
      menu: [
        { key: 'jump', label: '跳一跳', url: 'https://haiyong.site/moyu/tyt/' },
        { key: 'car', label: '汽车', url: 'https://haiyong.site/moyu/slowroads/' },
        { key: 'xiangqi', label: '中国象棋', url: 'https://chess.z3web.cn/' },
        { key: 'sanguo', label: '三国志', url: 'https://fc.haiyong.site/games/%E4%B8%89%E5%9B%BD%E5%BF%97%20-%20%E4%B8%AD%E5%8E%9F%E4%B9%8B%E9%9C%B8%E8%80%85(%E7%AE%80)[%E8%B0%88%E9%AD%88%E7%96%AF%E7%94%9F](JP)[SLG](3Mb)/' },
      ]
    },
  },
  {
    path: '/dream',
    name: 'dream',
    component: () => import('@/views/Dream.vue'),
    meta: {
      title: '集梦盒子',
      keepAlive: true,
      requiresAuth: true,
      layout: 'default',
      menu: [
        { key: 'dream-hall', label: '梦境大厅', icon: 'user-outlined' },
        { key: 'my-dream', label: '我的梦境', icon: 'appstore-outlined' },
      ]
    },
  },
  {
    path: '/daily-quote',
    name: 'DailyQuote',
    component: () => import('@/views/DailyQuote.vue'),
    meta: {
      title: '每日一句',
      keepAlive: true,
      requiresAuth: false,
      layout: 'default'
    },
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/Message.vue'),
    meta: {
      title: '消息中心',
      keepAlive: true,
      requiresAuth: true,
      layout: 'default',
      menu: [
        { key: 'system', label: '系统消息', icon: 'user-outlined' },
        { key: 'notification', label: '通知消息', icon: 'appstore-outlined' },
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
      requiresAuth: true,
      layout: 'default',
    },
  },
];

// 404路由
const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'NotFound',
  component: () => import('../views/NotFound.vue'),
  meta: {
    title: '404',
    keepAlive: true,
    requiresAuth: false,
    layout: 'blank',
  },
};

// 合并所有路由
const routes = [...publicRoutes, ...mainRoutes, ...adminRoutes, notFoundRoute];

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title as string || '默认标题'}`;

  // 判断是否需要登录权限
  if (to.meta.requiresAuth) {
    const userStore = useUserStore();
    if (!userStore.token) {
      message.warning('请先登录');
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存要跳转的路由
      });
      return;
    }

    // 检查角色权限
    const requiredRoles = to.meta.roles;
    console.log("🚀 ~ router.beforeEach ~ requiredRoles:", requiredRoles)
    if (requiredRoles && Array.isArray(requiredRoles) && requiredRoles.length > 0) {
      const hasPermission = requiredRoles.some(role => userStore.roles.includes(role));
      if (!hasPermission) {
        message.warning('您没有访问权限');
        next('/');
        return;
      }
    }
  }
  next();
});

export default router;