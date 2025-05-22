<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from 'vue'
import { Modal, Spin, message, Button } from 'ant-design-vue'
import { analyzeDream, updateDream } from '@/api/dream'
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

const userStore = useUserStore()
const isAdmin = computed(() => userStore.roles?.includes('admin'))

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


// 保存编辑内容
async function saveEdit() {
    if (!props.dream.id) return

    submitting.value = true
    await updateDream(props.dream.id, { interpretation: editContent.value })
    analysisContent.value = editContent.value
    message.success('分析内容已更新')
}

// 取消编辑
function cancelEdit() {
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
    <Modal v-model:open="visible" title="AI梦境分析" width="80%" @cancel="handleClose" :footer="null">
        <Spin :spinning="loading">
            <div class="analysis-content">
                <!-- 非admin只读预览 -->
                <div v-if="!isAdmin">
                    <MdPreview :model-value="analysisContent" />
                    <div v-if="!props.dream.interpretation" class="flex justify-end mt-4">
                        <Button type="primary" :loading="loading" @click="fetchAnalysis">AI分析</Button>
                    </div>
                </div>
                <!-- admin可编辑 -->
                <div v-else>
                    <div v-if="!props.dream.interpretation">
                        <div class="flex mt-4">
                            <Button type="primary" :loading="loading" @click="fetchAnalysis">AI分析</Button>
                        </div>
                        <div class="py-8 text-center text-gray-400">暂无分析结果</div>
                    </div>
                    <div>
                        <MdEditor v-model="editContent"
                            :toolbars="['bold', 'italic', 'strikeThrough', 'title', 'quote', 'unorderedList', 'orderedList', 'link', 'image', 'code', 'table', 'save']"
                            class="mb-4" height="300px" />
                        <div class="flex justify-end mt-4 space-x-2">
                            <Button @click="cancelEdit">取消</Button>
                            <Button type="primary" :loading="submitting" @click="saveEdit">保存</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Spin>
    </Modal>
</template>

<style scoped>
.analysis-content {
    min-height: 200px;
    padding: 5px;
}
</style>