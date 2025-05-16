import request from '@/utils/request';
import type { FormState, RegisterFormState, ResetFormState } from '@/types/form';

export function login(data: FormState) {
    return request({
        url: '/user/email/login',
        method: 'post',
        data,
    });
}

// GitHub登录
export function githubLogin(code: string) {
    return request({
        url: '/user/github/login',
        method: 'post',
        data: { code },
    });
}

export function register(data: RegisterFormState) {
    return request({
        url: '/user/email/register',
        method: 'post',
        data,
    });
}

export function resetPassword(data: ResetFormState) {
    return request({
        url: '/auth/reset-password',
        method: 'post',
        data,
    });
}

export function logout() {
    return request({
        url: '/auth/logout',
        method: 'post',
    });
}

export function sendCode(email: string) {
    return request({
        url: '/user/send-code',
        method: 'post',
        data: { email },
    });
}

export function validateCode(email: string, code: string) {
    return request({
        url: '/user/validate-code',
        method: 'post',
        data: { email, code },
    });
} 