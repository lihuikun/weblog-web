<template>
    <AModal :style="{
        width: '100vw',
        maxWidth: '100%',
        top: 0,
        margin: 0,
        paddingBottom: 0
    }" :contentStyle="{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        overflow: 'auto'
    }" v-model:open="visible" :footer="false" class="editor-modal">
        <template #title>
            <div class="text-2xl font-bold">{{ isPreview ? article.title : '创建文章' }}</div>
        </template>
        <div class="p-[20px] flex flex-col gap-4" v-if="!isPreview">
            <div class="flex flex-col gap-4">
                <AInput v-model:value="article.title" placeholder="请输入标题" />
                <ASelect v-model:value="article.categoryId" placeholder="请选择分类" width="200">
                    <ASelectOption v-for="category in categories" :key="category.key" :value="category.key">
                        {{ category.label }}
                    </ASelectOption>
                </ASelect>
                <AInput v-model:value="article.coverImage" placeholder="请输入封面图" />
            </div>
            <div>
                <MdEditor v-model="article.content" />
            </div>
            <div class="flex gap-4 justify-end">
                <AButton type="primary" @click="handleCreate">创建</AButton>
                <AButton type="primary" @click="handleUpdate">更新</AButton>
                <AButton type="primary" danger @click="handleDelete">删除</AButton>
            </div>
        </div>
        <div v-else>
            <MdPreview :modelValue="article.content" />
        </div>
    </AModal>
</template>
<script lang="ts" setup>
import { MdEditor, MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import 'md-editor-v3/lib/preview.css';
import { createArticle, updateArticle, deleteArticle } from '@/api/articles'
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Modal } from 'ant-design-vue';
interface Article {
    title: string
    content: string
    categoryId: string
    coverImage: string
    id: string
}
const { isPreview } = defineProps<{ isPreview: boolean }>()
const editorRef = shallowRef()
const emit = defineEmits<{
    (e: 'update:visible', visible: boolean): void
    (e: 'update:article', article: Article): void
}>()
const visible = defineModel<boolean>('visible')
const article = defineModel<Article>('article')
console.log("🚀 ~ article:", article)
const categories = ref([
    { key: 0, label: '最新文章', icon: 'user-outlined' },
    { key: 1, label: 'Vue', icon: 'appstore-outlined' },
    { key: 2, label: 'NestJs', icon: 'trophy-outlined' },
    { key: 3, label: '前端', icon: 'database-outlined' },
    { key: 4, label: '微信小程序', icon: 'code-outlined' },
    { key: 5, label: 'Node', icon: 'android-outlined' },
    { key: 6, label: '本站搭建', icon: 'android-outlined' },
])

async function handleUpdate() {
    const res = await updateArticle(article.value)
    if (res.code === 200) {
        message.success('更新成功')
    } else {
        message.error('更新失败')
    }
}

function handleDelete() {
    // 删除之前弹窗确认
    Modal.confirm({
        title: '确认删除',
        content: '确定要删除这篇文章吗？',
        onOk: async () => {
            const res = await deleteArticle(article.value.id)
            if (res.code === 200) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        }
    })
}

onMounted(async () => {
})

const handleCreate = async () => {
    const res = await createArticle(article.value)
    console.log("🚀 ~ handleCreate ~ res:", res)
}

function getModalContainer() {
    return document.body
}
</script>

<style lang="scss">
.editor-modal {
    :deep(.hk-modal-title) {
        color: red !important;
        font-weight: bold;
    }

    /* 如果Ant Design Vue使用了不同的前缀，尝试以下选择器 */
    :deep(.ant-modal-title) {
        color: red !important;
        font-weight: bold;
    }
}
</style>