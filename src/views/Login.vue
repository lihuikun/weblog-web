<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined, GithubOutlined, QqOutlined, WeiboOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons-vue';
import type { FormState, RegisterFormState } from '@/types/form';
import { login, register, githubLogin, sendCode } from '@/api/auth';
import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const route = useRoute();
const loading = ref(false);
const githubLoading = ref(false);
const isLogin = ref(true);
const userStore = useUserStore();

// 验证码倒计时相关
const isSending = ref(false);
const countdown = ref(0);
const countdownTimer = ref<number | null>(null);

const formState = reactive<FormState>({
    email: '',
    nickname: '',
    password: '',
    remember: true,
});

const registerFormState = reactive<RegisterFormState>({
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreement: false,
    code: '',
});

// 计算倒计时按钮文本
const countdownText = computed(() => {
    return countdown.value > 0 ? `${countdown.value}秒后重新发送` : '发送验证码';
});

// 计算按钮是否禁用
const isButtonDisabled = computed(() => {
    return countdown.value > 0 || isSending.value;
});

const loginRules = {
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码至少6个字符', trigger: 'blur' },
    ],
};

const registerRules = {
    nickname: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 4, message: '用户名至少4个字符', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码至少6个字符', trigger: 'blur' },
    ],
    confirmPassword: [
        { required: true, message: '请确认密码', trigger: 'blur' },
        {
            validator: (rule: any, value: string) => {
                if (value === registerFormState.password) {
                    return Promise.resolve();
                }
                return Promise.reject('两次输入的密码不一致');
            }, trigger: 'blur'
        },
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 6, message: '验证码应为6位数字', trigger: 'blur' },
    ],
    agreement: [
        {
            validator: (rule: any, value: boolean) => {
                if (value) {
                    return Promise.resolve();
                }
                return Promise.reject('请阅读并同意用户协议');
            }, trigger: 'change'
        },
    ],
};

const handleLoginSubmit = async () => {
    try {
        loading.value = true;
        const { data } = await login(formState);
        if (data?.token) {
            userStore.setToken(data.token);
            userStore.setUserInfo({
                avatarUrl: data.avatarUrl,
                nickname: data.nickname,
                roles: data.role,
                email: data.email,
                id: data.id
            });
            message.success('登录成功');
            const redirect = route.query.redirect as string;
            router.push(redirect || '/');
        }
    } catch (error: any) {
        message.error(error.message || '登录失败');
    } finally {
        loading.value = false;
    }
};

const handleRegisterSubmit = async () => {
    try {
        loading.value = true;
        const { data } = await register(registerFormState);
        if (data) {
            message.success('注册成功，请登录');
            isLogin.value = true;
        }
    } catch (error: any) {
        message.error(error.message || '注册失败');
    } finally {
        loading.value = false;
    }
};

// 发送验证码
const handleSendCode = async () => {
    // 验证邮箱格式
    if (!registerFormState.email) {
        message.warning('请先输入邮箱');
        return;
    }
    
    const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    if (!emailReg.test(registerFormState.email)) {
        message.warning('请输入有效的邮箱地址');
        return;
    }
    
    try {
        isSending.value = true;
        const { data } = await sendCode(registerFormState.email);
        if(!data.success) {
            message.error(data.message || '发送验证码失败');
            return;
        }
        
        // 如果发送成功，开始倒计时
        if (data.success) {
            startCountdown();
            message.success(data.message || '验证码已发送，请查收邮件');
        }
    } catch (error: any) {
        message.error(error.message || '发送验证码失败');
    } finally {
        isSending.value = false;
    }
};

// 开始倒计时
const startCountdown = () => {
    countdown.value = 60;
    
    // 清除可能存在的旧定时器
    if (countdownTimer.value) {
        clearInterval(countdownTimer.value);
    }
    
    // 设置新的定时器
    countdownTimer.value = window.setInterval(() => {
        if (countdown.value > 0) {
            countdown.value -= 1;
        } else {
            // 倒计时结束，清除定时器
            if (countdownTimer.value) {
                clearInterval(countdownTimer.value);
                countdownTimer.value = null;
            }
        }
    }, 1000);
};

const toggleForm = () => {
    isLogin.value = !isLogin.value;
};

function handleGithubLogin() {
    // 获取当前页面地址的域名
    const currentUrl = window.location.origin + '/#/login';
    const url = `https://github.com/login/oauth/authorize?client_id=${import.meta.env.VITE_JS_DAILY_GITHUB_CLIENT_ID}&redirect_uri=${currentUrl}`;
    window.location.href = url;
}

// 跳转回登录页面，拿到code，进行登录
async function handleGithubCallback() {
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get('code');
    console.log(code);
    if (!code) return
    const { data } = await githubLogin(code as string);
    console.log("🚀 ~ handleGithubCallback ~ data:", data)
    if (data?.token) {
        userStore.setToken(data.token);
        userStore.setUserInfo({
            avatarUrl: data.avatarUrl,
            nickname: data.nickname,
            roles: data.role,
            email: data.email,
            id: data.id
        });
        message.success('登录成功');
        // 跳转回首页去掉code
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('code');
        window.history.replaceState(null, '', cleanUrl.toString());
        router.push('/');
    }
}

onMounted(() => {
    handleGithubCallback();
    // 如果type为register，则设置isLogin为false
    if (route.query.type === 'register') {
        isLogin.value = false;
    }
});

// 组件卸载时清除定时器
onUnmounted(() => {
    if (countdownTimer.value) {
        clearInterval(countdownTimer.value);
        countdownTimer.value = null;
    }
});
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
                        {{ isLogin ? '欢迎回来' : '创建账号' }}
                    </h2>
                    <p class="mb-8 text-sm text-gray-600">
                        {{ isLogin ? '还没有账号？' : '已有账号？' }}
                        <a href="javascript:;" @click="toggleForm"
                            class="font-medium text-blue-600 transition-colors hover:text-blue-700">
                            {{ isLogin ? '立即注册' : '立即登录' }}
                        </a>
                    </p>
                </div>

                <!-- 登录表单 -->
                <a-form v-if="isLogin" :model="formState" :rules="loginRules" class="space-y-6"
                    @finish="handleLoginSubmit">
                    <div class="space-y-4">
                        <a-form-item name="email">
                            <a-input v-model:value="formState.email" size="large" placeholder="邮箱" class="login-input">
                                <template #prefix>
                                    <UserOutlined class="text-gray-400" />
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item name="password">
                            <a-input-password v-model:value="formState.password" size="large" placeholder="密码"
                                class="login-input">
                                <template #prefix>
                                    <LockOutlined class="text-gray-400" />
                                </template>
                            </a-input-password>
                        </a-form-item>
                    </div>

                    <div class="flex justify-between items-center">
                        <a-form-item name="remember" no-style>
                            <a-checkbox v-model:checked="formState.remember">
                                <span class="text-gray-600">记住我</span>
                            </a-checkbox>
                        </a-form-item>

                        <router-link to="/forgot-password"
                            class="text-sm text-blue-600 transition-colors hover:text-blue-700">
                            忘记密码？
                        </router-link>
                    </div>

                    <div>
                        <a-button :loading="loading" type="primary" html-type="submit"
                            class="w-full h-12 text-lg font-medium login-button">
                            {{ '登录' }}
                        </a-button>
                    </div>
                </a-form>

                <!-- 注册表单 -->
                <a-form v-else :model="registerFormState" :rules="registerRules" class="space-y-6"
                    @finish="handleRegisterSubmit">
                    <div class="space-y-4">
                        <a-form-item name="nickname">
                            <a-input v-model:value="registerFormState.nickname" size="large" placeholder="用户名"
                                class="login-input">
                                <template #prefix>
                                    <UserOutlined class="text-gray-400" />
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item name="email">
                            <a-input v-model:value="registerFormState.email" size="large" placeholder="邮箱"
                                class="login-input">
                                <template #prefix>
                                    <MailOutlined class="text-gray-400" />
                                </template>
                            </a-input>
                        </a-form-item>
                        
                        <!-- 验证码输入框 -->
                        <a-form-item name="code">
                            <div class="flex">
                                <a-input v-model:value="registerFormState.code" size="large" placeholder="验证码"
                                    class="flex-1 login-input">
                                    <template #prefix>
                                        <SafetyOutlined class="text-gray-400" />
                                    </template>
                                </a-input>
                                <a-button 
                                    type="primary" 
                                    size="large" 
                                    :disabled="isButtonDisabled"
                                    :loading="isSending"
                                    @click="handleSendCode"
                                    class="ml-2 w-35 verification-button"
                                >
                                    {{ countdownText }}
                                </a-button>
                            </div>
                        </a-form-item>
                        
                        <a-form-item name="password">
                            <a-input-password v-model:value="registerFormState.password" size="large" placeholder="密码"
                                class="login-input">
                                <template #prefix>
                                    <LockOutlined class="text-gray-400" />
                                </template>
                            </a-input-password>
                        </a-form-item>
                        <a-form-item name="confirmPassword">
                            <a-input-password v-model:value="registerFormState.confirmPassword" size="large"
                                placeholder="确认密码" class="login-input">
                                <template #prefix>
                                    <LockOutlined class="text-gray-400" />
                                </template>
                            </a-input-password>
                        </a-form-item>
                    </div>

                    <div>
                        <a-form-item name="agreement">
                            <a-checkbox v-model:checked="registerFormState.agreement">
                                <span class="text-gray-600">我已阅读并同意
                                    <a href="javascript:;" class="text-blue-600 hover:text-blue-700">用户协议</a>
                                    和
                                    <a href="javascript:;" class="text-blue-600 hover:text-blue-700">隐私政策</a>
                                </span>
                            </a-checkbox>
                        </a-form-item>
                    </div>

                    <div>
                        <a-button :loading="loading" type="primary" html-type="submit"
                            class="w-full h-12 text-lg font-medium login-button">
                            注册
                        </a-button>
                    </div>
                </a-form>

                <!-- 其他登录方式 -->
                <div class="pt-4">
                    <div class="relative">
                        <div class="flex absolute inset-0 items-center">
                            <div class="w-full border-t border-gray-200"></div>
                        </div>
                        <div class="flex relative justify-center text-sm">
                            <span class="px-4 text-gray-500 bg-white">其他登录方式</span>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 gap-3 mt-6">
                        <a-button class="social-button" @click="handleGithubLogin">
                            <GithubOutlined class="text-lg" />
                        </a-button>
                        <a-button class="social-button">
                            <QqOutlined class="text-lg" />
                        </a-button>
                        <a-button class="social-button">
                            <WeiboOutlined class="text-lg" />
                        </a-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-card {
    perspective: 1000px;
}

.login-card:hover {
    transform: translateY(-5px);
}

.login-input {
    @apply rounded-lg border-gray-200 hover:border-blue-500 focus:border-blue-500;
    transition: all 0.3s ease;
}

.login-input:hover {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.login-button {
    @apply rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700;
    transition: all 0.3s ease;
}

.login-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.verification-button {
    @apply rounded-lg;
    transition: all 0.3s ease;
    min-width: 120px;
}

.verification-button:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.social-button {
    @apply flex justify-center items-center w-full py-2 px-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-all duration-300;
}

.social-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 添加输入框动画效果 */
:deep(.ant-input-affix-wrapper) {
    transition: all 0.3s ease;
}

:deep(.ant-input-affix-wrapper:hover) {
    border-color: #4096ff;
}

:deep(.ant-input-affix-wrapper-focused) {
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
</style>