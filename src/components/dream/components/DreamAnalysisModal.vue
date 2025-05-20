<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue'
import { Modal, Spin, Input, message, Button } from 'ant-design-vue'
import { analyzeDream, updateDream } from '@/api/dream'

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

// 获取AI分析结果
async function fetchAnalysis() {
    if (!props.dream.id) return

    loading.value = true
    try {
        const res = await analyzeDream(props.dream.id)
        analysisContent.value = res.data?.analysis || '暂无分析结果'
        editContent.value = analysisContent.value
    } catch (error) {
        console.error('获取分析失败', error)
        message.error('获取分析结果失败')
        analysisContent.value = '获取分析结果失败'
    } finally {
        loading.value = false
    }
}

// 切换到编辑模式
function toggleEdit() {
    isEditing.value = !isEditing.value
    if (isEditing.value) {
        editContent.value = analysisContent.value
    }
}

// 保存编辑内容
async function saveEdit() {
    if (!props.dream.id) return

    submitting.value = true
    await updateDream(props.dream.id, { interpretation: editContent.value })
    analysisContent.value = editContent.value
    message.success('分析内容已更新')
    isEditing.value = false
}

// 取消编辑
function cancelEdit() {
    isEditing.value = false
    editContent.value = analysisContent.value
}

// 关闭模态框
function handleClose() {
    isEditing.value = false
    emit('update:visible', false)
}
const visible = computed({
    get: () => props.visible,
    set: (newVal) => {
        if (!newVal) {
            isEditing.value = false
            editContent.value = analysisContent.value
        }
    }
})
// 当visible或dreamId变化时获取分析结果
watch(() => [props.visible, props.dream.id], ([visible, id]) => {
    if (visible && id) {
        // fetchAnalysis()
        analysisContent.value = props.dream.interpretation || '暂无分析结果'
        editContent.value = props.dream.interpretation || ''
    }
})
</script>

<template>
    <Modal v-model:open="visible" title="AI梦境分析" :width="600" @cancel="handleClose" :footer="null">
        <Spin :spinning="loading">
            <div class="analysis-content">
                <!-- 分析内容展示区 -->
                <div v-if="!isEditing" class="analysis-display">
                    <div class="analysis-text">{{ analysisContent }}</div>

                    <!-- admin可编辑的按钮 -->
                    <div class="flex justify-end mt-4">
                        <Button v-permission="'admin'" type="primary" @click="toggleEdit">
                            编辑分析
                        </Button>
                    </div>
                </div>

                <!-- 编辑模式 -->
                <div v-else class="analysis-edit">
                    <Input.TextArea v-model:value="editContent" :rows="8" placeholder="请输入分析内容" />

                    <div class="flex justify-end mt-4 space-x-2">
                        <Button @click="cancelEdit">取消</Button>
                        <Button type="primary" :loading="submitting" @click="saveEdit">
                            保存
                        </Button>
                    </div>
                </div>
            </div>
        </Spin>
    </Modal>
</template>

<style scoped>
.analysis-content {
    min-height: 200px;
    padding: 16px;
}

.analysis-text {
    font-size: 16px;
    line-height: 1.6;
    white-space: pre-wrap;
}

.analysis-edit {
    margin-top: 12px;
}
</style>