<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message, List, Avatar, Badge, Spin, Tag, Button, Modal, Form, Input, Radio } from 'ant-design-vue'
import { CheckOutlined, BellOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons-vue'
import { getMessages, readMessage, readAllMessages, MessageItem, publishMessage, PublishMessageParams } from '@/api/message'

const router = useRouter()
const route = useRoute()
const activeTab = ref('system')
const showPublishModal = ref(false)
const publishForm = ref<{
    content: string;
    redirectUrl: string;
    type: 'system' | 'notification';
}>({
    content: '',
    redirectUrl: '',
    type: 'system'
})
const publishLoading = ref(false)

// 分页相关
const messages = ref<MessageItem[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const markingAllAsRead = ref(false)

// 获取消息列表
async function fetchMessages(isLoadMore = false) {
    if (isLoadMore) {
        loadingMore.value = true
    } else {
        loading.value = true
    }

    try {
        // 后端API接口
        const res = await getMessages({
            page: page.value,
            pageSize: pageSize.value,
            type: activeTab.value as 'system' | 'notification'
        })

        const { list, total: totalCount } = res.data || { list: [], total: 0 }

        if (isLoadMore) {
            messages.value = [...messages.value, ...list]
        } else {
            messages.value = list || []
        }

        total.value = totalCount
        hasMore.value = messages.value.length < totalCount
    } catch (error) {
        console.error('获取消息失败', error)
    } finally {
        loading.value = false
        loadingMore.value = false
    }
}


// 加载更多
async function loadMore() {
    if (loadingMore.value || !hasMore.value) return

    page.value++
    await fetchMessages(true)
}

// 监听滚动到底部
function handleScroll(e: Event) {
    const element = e.target as HTMLElement
    const scrollBottom = element.scrollHeight - element.scrollTop - element.clientHeight

    if (scrollBottom < 50 && !loadingMore.value && hasMore.value) {
        loadMore()
    }
}

// 阅读消息
async function markAsRead(item: MessageItem) {
    if (item.isRead) return

    try {
        // 调用API标记已读
        await readMessage(item.id)

        // 更新本地状态
        const index = messages.value.findIndex(msg => msg.id === item.id)
        if (index !== -1) {
            messages.value[index].isRead = true
        }

        message.success('已标记为已读')
    } catch (error) {
        console.error('标记已读失败', error)
        // 模拟标记成功
        const index = messages.value.findIndex(msg => msg.id === item.id)
        if (index !== -1) {
            messages.value[index].isRead = true
        }
    }
}

// 全部标记为已读
async function markAllAsRead() {
    markingAllAsRead.value = true

    try {
        await readAllMessages({ type: activeTab.value as 'system' | 'notification' })

        // 更新本地状态
        messages.value.forEach(msg => {
            msg.isRead = true
        })

        message.success('全部标记为已读')
    } catch (error) {
        console.error('全部标记已读失败', error)

        // 模拟标记成功
        messages.value.forEach(msg => {
            msg.isRead = true
        })
    } finally {
        markingAllAsRead.value = false
    }
}

// 处理消息点击
function handleMessageClick(item: MessageItem) {
    // 标记为已读
    markAsRead(item)

    // 如果有跳转链接，则跳转
    if (item.redirectUrl) {
        router.push(item.redirectUrl)
    }
}

// 获取日期显示
function getFormattedDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })
}
const { sideMenuId } = defineProps<{ sideMenuId: string[] }>();
// 监听路由变化
watchEffect(() => {
    console.log('111', sideMenuId)
    if (sideMenuId) {
        activeTab.value = sideMenuId[0]
        page.value = 1
        fetchMessages()
    }
})

// 发布消息
async function handlePublishMessage() {
    publishLoading.value = true
    try {
        // 调用API发布消息
        await publishMessage(publishForm.value as PublishMessageParams)

        message.success('消息发布成功')
        showPublishModal.value = false

        // 重置表单
        publishForm.value = {
            content: '',
            redirectUrl: '',
            type: 'system'
        }

        // 刷新消息列表
        page.value = 1
        await fetchMessages()
    } catch (error) {
        console.error('发布消息失败', error)
        message.error('发布消息失败')
    } finally {
        publishLoading.value = false
    }
}

</script>

<template>
    <div class="flex flex-col h-full bg-white message-container">
        <div class="message-header">
            <h1>消息中心</h1>
            <div class="flex gap-3 items-center">
                <Button v-permission="'admin'" type="primary" @click="showPublishModal = true">
                    发布消息
                </Button>
            </div>
        </div>

        <div class="overflow-y-auto flex-1 scrollbar-hide message-list" @scroll="handleScroll">
            <Spin :spinning="loading">
                <List v-if="messages.length" class="message-list-inner">
                    <List.Item v-for="item in messages" :key="item.id" class="message-item"
                        @click="handleMessageClick(item)">
                        <List.Item.Meta>
                            <template #avatar>
                                <Badge :dot="!item.isRead" color="red">
                                    <Avatar :class="[item.type === 'system' ? 'bg-blue-500' : 'bg-green-500']">
                                        <template #default>
                                            <span class="text-sm font-bold font-white">
                                                {{ item.type === 'system' ? '系' : '通' }}
                                            </span>
                                        </template>
                                    </Avatar>
                                </Badge>
                            </template>
                            <template #title>
                                <div class="flex justify-between">
                                    <span :class="{ 'font-bold': !item.isRead }">{{ item.content }}</span>
                                </div>
                            </template>
                            <template #description>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-400 message-time">{{ getFormattedDate(item.createdAt)
                                        }}</span>
                                    <div class="message-actions">
                                        <Tag v-if="item.isRead" color="green">
                                            已读
                                        </Tag>
                                        <Tag v-else color="red">未读</Tag>
                                    </div>
                                </div>
                            </template>
                        </List.Item.Meta>
                    </List.Item>
                </List>

                <!-- 加载更多状态 -->
                <div v-if="loadingMore" class="flex justify-center py-4">
                    <Spin />
                </div>

                <!-- 无更多数据 -->
                <div v-if="!hasMore && messages.length > 0" class="py-4 text-center text-gray-400">
                    已经到底啦 ~
                </div>

                <!-- 无消息数据提示 -->
                <div v-if="!messages.length && !loading" class="empty-tip">
                    <p>暂无{{ activeTab === 'system' ? '系统' : '通知' }}消息</p>
                </div>
            </Spin>
        </div>
    </div>

    <!-- 发布消息弹窗 -->
    <Modal v-model:open="showPublishModal" title="发布消息" @ok="handlePublishMessage" :confirmLoading="publishLoading">
        <Form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
            <Form.Item label="类型">
                <Radio.Group v-model:value="publishForm.type">
                    <Radio value="system">系统消息</Radio>
                    <Radio value="notification">通知消息</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item label="内容">
                <Input.TextArea v-model:value="publishForm.content" :rows="4" placeholder="请输入消息内容" />
            </Form.Item>
            <Form.Item label="跳转链接">
                <Input v-model:value="publishForm.redirectUrl" placeholder="选填，如: /home" />
            </Form.Item>
        </Form>
    </Modal>
</template>

<style scoped>
.message-container {
    max-width: 900px;
    margin: 0 auto;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
    padding: 32px 24px;
}

.message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 16px;
}

.message-header h1 {
    font-size: 24px;
    margin: 0;
    font-weight: 600;
    background: linear-gradient(45deg, #1890ff, #36cfc9);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
}

.message-list {
    width: 100%;
}

.message-item {
    padding: 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
    cursor: pointer;
    margin-bottom: 8px;
}

.message-item:hover {
    background-color: #f5f5f5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message-content {
    max-width: 70%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.message-actions {
    display: flex;
    gap: 8px;
}

.empty-tip {
    text-align: center;
    color: #bbb;
    margin: 48px 0;
    font-size: 16px;
    padding: 40px;
    background: #f9f9f9;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

@media (max-width: 768px) {
    .message-container {
        padding: 20px 16px;
        margin: 0;
        border-radius: 0;
        box-shadow: none;
    }

    .message-header {
        margin-bottom: 20px;
    }
}
</style>