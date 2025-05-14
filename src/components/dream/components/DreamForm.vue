<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue'
import { message, Form, Input, Select, Switch } from 'ant-design-vue'
import { CreateDreamParams } from '@/api/dream'

const props = defineProps<{
    formState: CreateDreamParams
    title?: string
    isEdit?: boolean
    submitting?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:formState', value: CreateDreamParams): void
    (e: 'submit'): void
    (e: 'cancel'): void
}>()

const formRef = ref()

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

// 表单校验规则
const rules = {
    title: [{ required: true, message: '请输入梦境标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入梦境内容', trigger: 'blur' }],
    emotion: [{ required: true, message: '请选择心情', trigger: 'change' }]
}

// 提供表单校验方法给父组件
defineExpose({
    validate: async () => {
        if (!formRef.value) return false
        try {
            await formRef.value.validate()
            return true
        } catch (e) {
            return false
        }
    },
    resetFields: () => {
        formRef.value?.resetFields()
    }
})
</script>

<template>
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

        <!-- 是否分享到集梦大厅 -->
        <a-form-item name="isShared" label="是否分享到集梦大厅">
            <a-switch v-model:checked="formState.isShared" />
        </a-form-item>
    </a-form>
</template>