<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { LockOutlined } from '@ant-design/icons-vue';

interface ResetForm {
    password: string;
    confirmPassword: string;
}

const router = useRouter();
const loading = ref(false);

const formState = reactive<ResetForm>({
    password: '',
    confirmPassword: '',
});

const rules = {
    password: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码至少6个字符', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请确认新密码', trigger: 'blur' },
        {
            validator: async (_rule: any, value: string) => {
                if (value !== formState.password) {
                    return Promise.reject('两次输入的密码不一致');
                }
                return Promise.resolve();
            },
            trigger: 'blur',
        },
    ],
};

const handleSubmit = async () => {
    try {
        loading.value = true;
        // 这里添加重置密码API调用
        message.success('密码重置成功');
        router.push('/login');
    } catch (error: any) {
        message.error(error.message || '密码重置失败');
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-50 to-pink-50">
        <div class="w-full max-w-md transition-all duration-300 transform login-card">
            <div class="p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
                <!-- Logo区域 -->
                <div class="text-center">
                    <div class="inline-block p-4 mb-4 bg-blue-50 rounded-full">
                        <img src="@/assets/logo.jpg" alt="logo" class="w-16 h-16 rounded-full">
                    </div>
                    <h2 class="mb-2 text-3xl font-bold text-gray-900">
                        重置密码
                    </h2>
                    <p class="mb-8 text-sm text-gray-600">
                        请输入您的新密码
                    </p>
                </div>

                <!-- 重置密码表单 -->
                <a-form :model="formState" :rules="rules" class="space-y-6" @finish="handleSubmit">
                    <div class="space-y-4">
                        <a-form-item name="password">
                            <a-input v-model:value="formState.password" size="large" placeholder="新密码" type="password">
                                <template #prefix>
                                    <LockOutlined class="site-form-item-icon" />
                                </template>
                            </a-input>
                        </a-form-item>

                        <a-form-item name="confirmPassword">
                            <a-input v-model:value="formState.confirmPassword" size="large" placeholder="确认新密码"
                                type="password">
                                <template #prefix>
                                    <LockOutlined class="site-form-item-icon" />
                                </template>
                            </a-input>
                        </a-form-item>
                    </div>

                    <a-form-item>
                        <a-button :loading="loading" type="primary" html-type="submit"
                            class="w-full h-12 text-base font-medium rounded-lg transition-all duration-300 hover:shadow-lg">
                            确认修改
                        </a-button>
                    </a-form-item>

                    <div class="text-center">
                        <router-link to="/login"
                            class="font-medium text-blue-600 transition-colors hover:text-blue-700">
                            返回登录
                        </router-link>
                    </div>
                </a-form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-card {
    transition: all 0.3s ease;
}

.login-card:hover {
    transform: translateY(-5px);
}

.ant-input-affix-wrapper {
    border-radius: 8px;
    height: 48px;
}

.ant-btn-primary {
    background-color: #1890ff;
}
</style>