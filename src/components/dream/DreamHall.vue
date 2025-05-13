<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message, Tag, Button, Card, Modal, Form, Input, Select } from 'ant-design-vue'
import { getDreamHall, createDream, CreateDreamParams } from '@/api/dream'

const router = useRouter()
const dreams = ref<any[]>([])
const loading = ref(false)
const formRef = ref()

// 检查登录
function checkLogin() {
    const token = localStorage.getItem('token')
    if (!token) {
        message.warning('请先登录')
        router.push('/login')
        return false
    }
    return true
}

// 获取梦境大厅数据
async function fetchDreams() {
    loading.value = true
    try {
        const res = await getDreamHall()
        dreams.value = res.data || []
    } catch (e) {
        console.error(e)
        message.error('获取梦境失败')
    } finally {
        loading.value = false
    }
}

// 创建梦境表单
const showModal = ref(false)
const submitting = ref(false)
const formState = ref<CreateDreamParams>({
    title: '',
    content: '',
    emotion: 'happy',
    tags: []
})

// 可选的心情列表
const moodOptions = [
    { value: 'happy', label: '开心' },
    { value: 'sad', label: '悲伤' },
    { value: 'excited', label: '兴奋' },
    { value: 'worried', label: '担忧' },
    { value: 'calm', label: '平静' }
]

// 可选的标签列表
const tagOptions = [
    { value: 'love', label: '爱情' },
    { value: 'family', label: '家庭' },
    { value: 'work', label: '工作' },
    { value: 'adventure', label: '冒险' },
    { value: 'nightmare', label: '噩梦' },
    { value: 'fantasy', label: '奇幻' }
]

// 打开创建梦境对话框
function handleCreate() {
    if (!checkLogin()) return
    showModal.value = true
}

// 提交创建梦境
async function handleSubmit() {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        submitting.value = true

        await createDream(formState.value)
        message.success('梦境创建成功')
        showModal.value = false

        // 重置表单
        formState.value = {
            title: '',
            content: '',
            emotion: 'happy',
            tags: []
        }

        // 刷新梦境列表
        fetchDreams()
    } catch (e) {
        console.error(e)
        message.error('梦境创建失败')
    } finally {
        submitting.value = false
    }
}

function handleCancel() {
    showModal.value = false
}

// 表单校验规则
const rules = {
    title: [{ required: true, message: '请输入梦境标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入梦境内容', trigger: 'blur' }],
    emotion: [{ required: true, message: '请选择心情', trigger: 'change' }]
}

// 根据标签获取颜色
function getTagColor(tag: string): string {
    const colorMap: Record<string, string> = {
        love: 'pink',
        family: 'green',
        work: 'blue',
        adventure: 'purple',
        nightmare: 'red',
        fantasy: 'cyan'
    }
    return colorMap[tag] || 'blue'
}

onMounted(() => {
    fetchDreams()
})
</script>

<template>
    <div class="dream-hall-container">
        <div class="dream-hall-header">
            <h1>梦境大厅</h1>
            <Button type="primary" @click="handleCreate">创建梦境</Button>
        </div>

        <div class="dream-list">
            <a-spin :spinning="loading">
                <Card v-for="dream in dreams" :key="dream.id" class="dream-card" :title="dream.title" hoverable>
                    <template #extra>
                        <span class="dream-date">{{ new Date(dream.createdAt).toLocaleDateString() }}</span>
                    </template>

                    <div class="dream-content">{{ dream.content }}</div>

                    <div class="dream-meta">
                        <span class="dream-mood">
                            心情：{{moodOptions.find(m => m.value === dream.emotion)?.label || dream.emotion}}
                        </span>
                        <div class="dream-tags">
                            <Tag v-for="tag in dream.tags" :key="tag" :color="getTagColor(tag)">
                                {{tagOptions.find(t => t.value === tag)?.label || tag}}
                            </Tag>
                        </div>
                    </div>
                </Card>

                <div v-if="!dreams.length && !loading" class="empty-tip">
                    暂无梦境，快来创建吧！
                </div>
            </a-spin>
        </div>

        <!-- 创建梦境对话框 -->
        <Modal v-model:open="showModal" title="创建梦境" :width="500" :confirmLoading="submitting" @ok="handleSubmit"
            @cancel="handleCancel">
            <a-form :model="formState" ref="formRef" :rules="rules" layout="vertical">
                <a-form-item name="title" label="梦境标题" required>
                    <a-input v-model:value="formState.title" placeholder="给你的梦境起个名字吧" />
                </a-form-item>

                <a-form-item name="content" label="梦境内容" required>
                    <a-textarea v-model:value="formState.content" :rows="4" placeholder="描述一下你的梦境..." />
                </a-form-item>

                <a-form-item name="emotion" label="心情" required>
                    <a-select v-model:value="formState.emotion" placeholder="选择心情">
                        <a-select-option v-for="option in moodOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item name="tags" label="标签">
                    <a-select v-model:value="formState.tags" mode="multiple" placeholder="选择标签(可多选)" :maxTagCount="3">
                        <a-select-option v-for="option in tagOptions" :key="option.value" :value="option.value">
                            {{ option.label }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-form>
        </Modal>
    </div>
</template>

<style scoped>
.dream-hall-container {
    max-width: 900px;
    margin: 0 auto;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
    padding: 32px 24px;
}

.dream-hall-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 16px;
}

.dream-hall-header h1 {
    font-size: 24px;
    color: #333;
    margin: 0;
    font-weight: 600;
}

.dream-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
}

.dream-card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    height: 100%;
}

.dream-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.dream-content {
    font-size: 15px;
    margin-bottom: 16px;
    color: #333;
    line-height: 1.6;
    max-height: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
}

.dream-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
}

.dream-mood {
    color: #722ed1;
    font-weight: 500;
    padding: 2px 6px;
    background: #f9f0ff;
    border-radius: 4px;
    font-size: 13px;
}

.dream-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.dream-date {
    color: #999;
    font-size: 13px;
}

.empty-tip {
    text-align: center;
    color: #bbb;
    margin: 48px 0;
    font-size: 16px;
    grid-column: 1 / -1;
    padding: 40px;
    background: #f9f9f9;
    border-radius: 8px;
}

@media (max-width: 768px) {
    .dream-hall-container {
        padding: 20px 16px;
        margin: 0;
        border-radius: 0;
        box-shadow: none;
    }

    .dream-hall-header {
        margin-bottom: 20px;
    }
}
</style>
