import { RouteRecordRaw } from 'vue-router';


export interface Menu {
    key: string;
    label: string;
    icon: string;
}

// 需要主布局的路由配置
const adminRoutes: Array<RouteRecordRaw> = [
    {
        path: '/admin/interview-manage',
        name: 'InterviewManage',
        component: () => import('@/admin/InterviewManage.vue'),
        meta: {
            title: '前端宝典管理',
            keepAlive: true,
            requiresAuth: true,
            roles: ['admin', 'subAdmin'],
            layout: 'admin'
        },
    },
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
        path: '/admin/database-manage',
        name: 'DatabaseManage',
        component: () => import('@/admin/DatabaseManage.vue'),
        meta: {
            title: '数据库管理',
            keepAlive: true,
            requiresAuth: true,
            roles: ['admin', 'subAdmin'],
            layout: 'admin'
        },
    },
    
    {
        path: '/admin/resume-template-manage',
        name: 'ResumeTemplateManage',
        component: () => import('@/admin/ResumeTemplateManage.vue'),
        meta: {
            title: '简历模板管理',
            keepAlive: true,
            requiresAuth: true,
            roles: ['admin', 'subAdmin'],
            layout: 'admin'
        },
    },
    {
        path: '/admin/guestbook-manage',
        name: 'GuestbookManage',
        component: () => import('@/admin/GuestbookManage.vue'),
        meta: {
            title: '留言板管理',
            keepAlive: true,
            requiresAuth: true,
            roles: ['admin', 'subAdmin'],
            layout: 'admin'
        },
    },
];

export default adminRoutes; 