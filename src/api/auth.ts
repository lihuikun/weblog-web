import request from '@/utils/request';
import type { FormState, RegisterFormState, ResetFormState } from '@/types/form';

export function login(data: FormState) {
    return request({
        url: '/auth/login',
        method: 'post',
        data,
    });
}

export function register(data: RegisterFormState) {
    return request({
        url: '/auth/register',
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