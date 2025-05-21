<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { message, Tag, Button, Card, Modal } from 'ant-design-vue'
import { RobotOutlined } from '@ant-design/icons-vue'
import { getDreamHall, createDream, CreateDreamParams, deleteDream } from '@/api/dream'
import DreamForm from './components/DreamForm.vue'
import DreamAnalysisModal from './components/DreamAnalysisModal.vue'
import { useUserStore } from '@/stores/userStore'

const router = useRouter()
const dreams = ref<any[]>([])
const loading = ref(false)
const formRef = ref()

// 分页相关
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const hasMore = ref(true) // 是否还有更多数据
const loadingMore = ref(false) // 加载更多状态

// 检查登录
function checkLogin() {
    const token = useUserStore().token
    if (!token) {
        message.warning('请先登录')
        router.push('/login')
        return false
    }
    return true
}

// 获取梦境大厅数据
async function fetchDreams(isLoadMore = false) {
    if (isLoadMore) {
        loadingMore.value = true
    } else {
        loading.value = true
    }

    try {
        const res = await getDreamHall({
            page: page.value,
            pageSize: pageSize.value
        })

        const { list, total: totalCount } = res.data || { list: [], total: 0 }

        if (isLoadMore) {
            dreams.value = [...dreams.value, ...list]
        } else {
            dreams.value = list || []
        }

        total.value = totalCount
        hasMore.value = dreams.value.length < total.value
    } catch (e) {
        console.error(e)
        message.error('获取梦境失败')
    } finally {
        loading.value = false
        loadingMore.value = false
    }
}

// 加载更多
async function loadMore() {
    if (loadingMore.value || !hasMore.value) return

    page.value++
    await fetchDreams(true)
}

// 监听滚动到底部
function handleScroll(e: Event) {
    const element = e.target as HTMLElement
    const scrollBottom = element.scrollHeight - element.scrollTop - element.clientHeight

    if (scrollBottom < 50 && !loadingMore.value && hasMore.value) {
        loadMore()
    }
}

// 创建梦境表单
const showModal = ref(false)
const submitting = ref(false)
const formState = ref<CreateDreamParams>({
    title: '',
    content: '',
    emotion: 'happy',
    tags: [],
    isShared: true
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
    try {
        const dreamFormRef = formRef.value
        if (!dreamFormRef) return

        const isValid = await dreamFormRef.validate()
        if (!isValid) return

        submitting.value = true

        await createDream(formState.value)
        message.success('梦境创建成功')
        showModal.value = false

        // 重置表单
        formState.value = {
            title: '',
            content: '',
            emotion: 'happy',
            tags: [],
            isShared: true
        }
        dreamFormRef.resetFields()

        // 重置页码并重新获取数据
        page.value = 1
        await fetchDreams()
    } catch (e) {
        console.error(e)
    } finally {
        submitting.value = false
    }
}

function handleCancel() {
    showModal.value = false
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
// 删除梦境
async function handleDelete(id: string) {
    if (!checkLogin()) return
    try {
        await deleteDream(id)
        message.success('梦境删除成功')
        // 如果当前页没有数据了，回到上一页
        if (dreams.value.length === 1 && page.value > 1) {
            page.value--
        }
        // 删除当前梦境
        dreams.value = dreams.value.filter(dream => dream.id !== id)
    } catch (e) {
        console.error(e)
        message.error('梦境删除失败')
    }
}

// AI分析相关
const showAnalysisModal = ref(false)
const currentAnalyzeDream = ref<any>({})

// 打开AI分析对话框
function handleAnalyze(dream: any) {
    if (!checkLogin()) return
    currentAnalyzeDream.value = dream
    showAnalysisModal.value = true
}

onMounted(() => {
    fetchDreams()
})
</script>

<template>
    <div class="p-4 w-full h-full">
        <!-- 标题栏 -->
        <div class="flex justify-between items-center pb-4 mb-6 border-b">
            <h1 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                梦境大厅
            </h1>
            <Button type="primary" @click="handleCreate" class="!rounded-full !px-6 !font-semibold">
                创建梦境
            </Button>
        </div>

        <!-- 梦境列表 -->
        <div class="overflow-y-auto flex-1" @scroll="handleScroll">
            <a-spin :spinning="loading">
                <div class="flex flex-col gap-4">
                    <div v-for="dream in dreams" :key="dream.id"
                        class="flex flex-col gap-3 p-6 w-full bg-gray-50 rounded-xl shadow transition hover:shadow-xl">
                        <!-- 标题和AI分析 -->
                        <div class="flex justify-between items-center">
                            <div class="text-lg font-semibold truncate">{{ dream.title }}</div>
                            <Button v-if="dream.id" type="text" shape="circle" @click="handleAnalyze(dream)"
                                class="!text-blue-500 flex items-center justify-center">
                                <template #icon>
                                    <img src="@/assets/icons/ai.png" class="w-6" />
                                </template>
                            </Button>
                        </div>
                        <!-- 内容 -->
                        <div class="text-gray-700 text-base line-clamp-4 min-h-[64px]">
                            {{ dream.content }}
                        </div>
                        <!-- 心情/日期/标签 -->
                        <div class="flex flex-wrap gap-2 justify-between items-center text-sm text-gray-500">
                            <div>
                                <span class="px-2 py-0.5 mr-2 font-medium text-purple-600 bg-purple-50 rounded">
                                    心情：{{moodOptions.find(m => m.value === dream.emotion)?.label || dream.emotion}}
                                </span>
                                <span>{{ new Date(dream.createTime).toLocaleDateString() }}</span>
                            </div>
                            <div class="flex flex-wrap gap-1">
                                <span v-for="tag in dream.tags" :key="tag"
                                    class="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-100 rounded">
                                    {{tagOptions.find(t => t.value === tag)?.label || tag}}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 加载更多/无更多数据 -->
                <div v-if="loadingMore" class="flex justify-center py-4">
                    <a-spin />
                </div>
                <div v-if="!hasMore && dreams.length > 0" class="py-6 text-center text-gray-400">
                    已经到底啦 ~
                </div>
                <div v-if="!dreams.length && !loading" class="py-16 text-center text-gray-400">
                    暂无梦境，快来创建吧！
                </div>
            </a-spin>
        </div>

        <!-- 创建梦境对话框 -->
        <Modal v-model:open="showModal" title="创建梦境" :width="500" :confirmLoading="submitting" @ok="handleSubmit"
            @cancel="handleCancel">
            <DreamForm ref="formRef" v-model:formState="formState" :title="'创建梦境'" :submitting="submitting" />
        </Modal>

        <!-- AI分析对话框 -->
        <DreamAnalysisModal v-model:visible="showAnalysisModal" :dream="currentAnalyzeDream" />
    </div>
</template>
