import { RouteRecordRaw } from 'vue-router';


export interface Menu {
    key: string;
    label: string;
    icon: string;
}

// 需要主布局的路由配置
const adminRoutes: Array<RouteRecordRaw> = [
    {
        path: '/admin/user-manage',
        name: 'UserManage',
        component: () => import('@/admin/UserManage.vue'),
        meta: {
            title: '用户管理',
            keepAlive: true,
            requiresAuth: true,
            roles: ['admin', 'subAdmin'],
            layout: 'admin'
        },
    },
    {
        path: '/admin/message-manage',
        name: 'MessageManage',
        component: () => import('@/admin/MessageManage.vue'),
        meta: {
            title: '消息管理',
            keepAlive: true,
            requiresAuth: true,
            roles: ['admin', 'subAdmin'],
            layout: 'admin'
        },
    },
    {
        path: '/admin/interview-manage',
        name: 'InterviewManage',
        component: () => import('@/admin/InterviewManage.vue'),
        meta: {
            title: '面试题管理',
            keepAlive: true,
            requiresAuth: true,
            roles: ['admin', 'subAdmin'],
            layout: 'admin'
        },
    },
];

export default adminRoutes; 