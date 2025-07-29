<script setup lang="tsx">
import { ref } from 'vue'
import { Card, Tag, Modal } from 'ant-design-vue'
import vipIcon from '@/assets/vip.png'
import { useUserStore } from '@/stores/userStore'

const benefits = [
    '永久会员享受题库永久更新',
    '专属VIP标识',
    '优先体验新功能',
    '更多会员专属内容持续解锁...'
]
const userStore = useUserStore()
console.log('user', userStore.userInfo)
const isPremium = userStore.userInfo?.isPremium
const showContactModal = ref(false)

const openContactModal = () => {
  showContactModal.value = true
}
</script>

<template>
    <div class="vip-bg min-h-screen w-full flex flex-col items-center py-12 px-4">
        <div class="text-3xl font-bold mb-6 text-yellow-500 flex items-center gap-2">
            <img :src="vipIcon" width="32" height="32" class="animate-bounce" />
            会员权益
        </div>
        <div class="mb-10 text-lg text-gray-700">永久会员享受题库永久更新，更多专属特权等你来解锁！</div>
        <div class="flex flex-col items-center">
            <div v-if="!isPremium" class="mb-4 text-xl font-bold text-yellow-600">开通永久VIP</div>
            <div class="vip-card-animate">
                <Card class="vip-card shadow-xl rounded-2xl border-0">
                    <div class="flex flex-col items-center gap-4 py-6 px-8">
                        <img :src="vipIcon" width="48" height="48" class="mb-2 animate-spin-slow" />
                        <div class="text-2xl font-bold text-yellow-500 mb-2">永久VIP会员</div>
                        <Tag color="gold" class="mb-2">尊享</Tag>
                        <ul class="text-gray-700 text-base list-disc list-inside text-left mb-2">
                            <li v-for="b in benefits" :key="b">{{ b }}</li>
                        </ul>
                        <AButton v-if="!isPremium" class="mt-4 text-base text-yellow-700 font-semibold cursor-pointer hover:text-yellow-800" @click="openContactModal">联系客服开通</AButton>
                    </div>
                </Card>
            </div>
        </div>
        
        <Modal v-model:open="showContactModal" title="联系客服开通VIP" :footer="null" :width="400">
            <div class="flex flex-col items-center h-[500px]">
                <img src="https://gitee.com/lihuikun1/pic-bed/raw/master/images/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20250715093516.jpg" alt="客服二维码" class="w-full max-w-80 h-auto rounded-lg" />
                <div class="mt-4 text-center text-gray-600">扫描二维码联系客服开通VIP</div>
            </div>
        </Modal>
    </div>
</template>

<style lang="scss" scoped>
.vip-bg {
    background: linear-gradient(135deg, #fffbe6 0%, #f0fdfa 100%);
}
</style>