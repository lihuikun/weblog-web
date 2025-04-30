import { RouteRecordRaw } from 'vue-router';

const publicRoutes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/Login.vue'),
        meta: {
            title: '登录',
            requiresAuth: false,
            layout: 'blank'
        }
    },
    {
        path: '/forgot-password',
        name: 'ForgotPassword',
        component: () => import('@/views/ForgotPassword.vue'),
        meta: {
            title: '忘记密码',
            requiresAuth: false,
            layout: 'blank'
        }
    }
];

export default publicRoutes; 