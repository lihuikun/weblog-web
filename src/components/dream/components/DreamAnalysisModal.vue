<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed, nextTick } from 'vue'
import { message, Button } from 'ant-design-vue'
import { analyzeDreamStream, updateDream } from '@/api/dream'
import { useUserStore } from '@/stores/userStore'
import { MdEditor, MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import 'md-editor-v3/lib/preview.css'

const props = defineProps<{
    dream: any
    visible: boolean
}>()

const emit = defineEmits<{
    (e: 'update:visible', visible: boolean): void
}>()

const loading = ref(false)
const analysisContent = ref('')
const isEditing = ref(false)
const editContent = ref('')
const submitting = ref(false)
const streamingContent = ref('')
const isStreaming = ref(false)
const streamingContainer = ref<HTMLElement>()
let streamController: { cancel: () => void } | null = null

const userStore = useUserStore()
const isAdmin = computed(() => userStore.roles?.includes('admin'))

// 显示的分析内容（流式过程中显示流式内容，完成后显示完整内容）
const displayContent = computed(() => {
    return isStreaming.value ? streamingContent.value : analysisContent.value
})

// 流式内容（带光标）
const streamingContentWithCursor = computed(() => {
    return streamingContent.value + ' <span class="typing-cursor">▊</span>'
})

// 自动滚动到底部
const scrollToBottom = async () => {
    await nextTick()
    if (streamingContainer.value) {
        streamingContainer.value.scrollTop = streamingContainer.value.scrollHeight
    }
}

// 获取AI分析结果（流式）
async function fetchAnalysis() {
    if (!props.dream.id) return

    loading.value = true
    isStreaming.value = true
    streamingContent.value = ''

    try {
        streamController = await analyzeDreamStream(
            props.dream.id,
            // onMessage: 接收到新内容
            (content: string) => {
                streamingContent.value += content
                // 每次更新内容后自动滚动
                scrollToBottom()
            },
            // onComplete: 流式完成
            () => {
                analysisContent.value = streamingContent.value
                editContent.value = streamingContent.value
                isStreaming.value = false
                loading.value = false
                streamController = null
                message.success('AI分析完成')
            },
            // onError: 发生错误
            (error: any) => {
                console.error('流式分析失败:', error)
                message.error('AI分析失败')
                isStreaming.value = false
                loading.value = false
                streamController = null
            }
        )

    } catch (error) {
        console.error('启动流式分析失败:', error)
        message.error('启动AI分析失败')
        loading.value = false
        isStreaming.value = false
        streamController = null
    }
}

// 保存编辑内容
async function saveEdit() {
    if (!props.dream.id) return

    submitting.value = true
    try {
        await updateDream(props.dream.id, { interpretation: editContent.value })
        analysisContent.value = editContent.value
        message.success('分析内容已更新')
        emit('update:visible', false)
    } catch (error) {
        message.error('保存失败')
    } finally {
        submitting.value = false
    }
}

// 取消编辑
function cancelEdit() {
    editContent.value = analysisContent.value
    emit('update:visible', false)
}

// 关闭模态框
function handleClose() {
    isEditing.value = false
    isStreaming.value = false
    emit('update:visible', false)
}

const visible = computed({
    get: () => props.visible,
    set: (newVal) => {
        if (!newVal) {
            isEditing.value = false
            isStreaming.value = false
            editContent.value = analysisContent.value
        }
    }
})

// 当visible或dreamId变化时获取分析结果
watch(() => [props.visible, props.dream.id], ([visible, id]) => {
    if (visible && id) {
        analysisContent.value = props.dream.interpretation || ''
        editContent.value = props.dream.interpretation || ''
        streamingContent.value = ''
    }
})
</script>

<template>
    <AModal v-model:open="visible" title="AI梦境分析" width="80%" @cancel="handleClose" :footer="null">
        <ASpin :spinning="loading && !isStreaming">
            <div class="analysis-content">
                <!-- 非admin只读预览 -->
                <div v-if="!isAdmin">
                    <div v-if="!displayContent && !isStreaming" class="py-8 text-center text-gray-400">
                        暂无分析结果
                    </div>
                    <div v-else>
                        <div ref="streamingContainer" class="overflow-y-auto max-h-96">
                            <!-- 流式显示时使用特殊格式 -->
                            <div v-if="isStreaming" class="streaming-content">
                                <MdPreview :model-value="streamingContentWithCursor" />
                            </div>
                            <!-- 非流式时正常显示 -->
                            <MdPreview v-else :model-value="displayContent" />
                        </div>
                        <div v-if="!props.dream.interpretation && !isStreaming" class="flex justify-end mt-4">
                            <AButton type="primary" :loading="loading" @click="fetchAnalysis">
                                AI分析
                            </AButton>
                        </div>
                    </div>
                </div>

                <!-- admin可编辑 -->
                <div v-else>
                    <div v-if="!props.dream.interpretation && !isStreaming && !analysisContent">
                        <div class="flex mt-4">
                            <AButton type="primary" :loading="loading" @click="fetchAnalysis">
                                AI分析
                            </AButton>
                        </div>
                        <div class="py-8 text-center text-gray-400">暂无分析结果</div>
                    </div>

                    <!-- 流式显示区域 -->
                    <div v-if="isStreaming">
                        <div class="p-4 mb-4 bg-blue-50 rounded-md">
                            <div class="flex gap-2 items-center mb-2">
                                <div class="loading-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                                <span class="text-sm text-blue-600">AI正在分析中...</span>
                            </div>
                        </div>
                        <div ref="streamingContainer" class="overflow-y-auto max-h-96">
                            <div class="streaming-content">
                                <MdPreview :model-value="streamingContentWithCursor" />
                            </div>
                        </div>
                    </div>

                    <!-- 编辑区域 -->
                    <div v-else-if="analysisContent || props.dream.interpretation">
                        <MdEditor v-model="editContent"
                            :toolbars="['bold', 'italic', 'strikeThrough', 'title', 'quote', 'unorderedList', 'orderedList', 'link', 'image', 'code', 'table']"
                            class="mb-4" height="400px" />
                        <div class="flex justify-between mt-4">
                            <AButton type="primary" :loading="loading" @click="fetchAnalysis">
                                重新分析
                            </AButton>
                            <div class="space-x-2">
                                <AButton @click="cancelEdit">取消</AButton>
                                <AButton type="primary" :loading="submitting" @click="saveEdit">
                                    保存
                                </AButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ASpin>
    </AModal>
</template>

<style lang="scss" scoped>
.analysis-content {
    min-height: 200px;
    padding: 5px;
}

// 流式内容容器
.streaming-content {
    .typing-cursor {
        color: #1890ff;
        animation: blink 1s infinite;
        font-weight: bold;
    }
}

// 打字机光标效果
.typing-cursor {
    display: inline-block;
    color: #1890ff;
    animation: blink 1s infinite;
    font-weight: bold;
    margin-left: 2px;
}

@keyframes blink {

    0%,
    50% {
        opacity: 1;
    }

    51%,
    100% {
        opacity: 0;
    }
}

// 加载动画
.loading-dots {
    display: inline-flex;
    gap: 2px;

    span {
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #1890ff;
        animation: loading 1.4s infinite ease-in-out both;

        &:nth-child(1) {
            animation-delay: -0.32s;
        }

        &:nth-child(2) {
            animation-delay: -0.16s;
        }

        &:nth-child(3) {
            animation-delay: 0s;
        }
    }
}

@keyframes loading {

    0%,
    80%,
    100% {
        transform: scale(0);
        opacity: 0.5;
    }

    40% {
        transform: scale(1);
        opacity: 1;
    }
}
</style>