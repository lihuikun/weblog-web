<script setup lang="tsx">
import { ref, onMounted } from 'vue'
import { message, Button, Popconfirm } from 'ant-design-vue'
import { getSquareCategoryList, createSquareCategory, updateSquareCategory, deleteSquareCategory } from '@/api/squareCategory'
import { useDateFormatter } from '@/hooks/useDateFormatter'

const categories = ref([])
const loading = ref(false)
const showEditModal = ref(false)
const isCreate = ref(false)
const editingId = ref<number | null>(null)
const editForm = ref<any>({})
const { formatDate } = useDateFormatter()

const fetchCategories = async () => {
    loading.value = true
    const { data } = await getSquareCategoryList()
    categories.value = data
    loading.value = false
}
const handleCreate = () => {
    isCreate.value = true
    editingId.value = null
    editForm.value = { name: '', description: '', image: '', sort: 0 }
    showEditModal.value = true
}
const handleEdit = (record: any) => {
    isCreate.value = false
    editingId.value = record.id
    editForm.value = { name: record.name, description: record.description, image: record.image, sort: record.sort }
    showEditModal.value = true
}
const handleSubmit = async () => {
    if (!editForm.value.name) {
        message.warning('请填写分类名称')
        return
    }
    if (isCreate.value) {
        await createSquareCategory(editForm.value)
        message.success('创建成功')
    } else if (editingId.value) {
        await updateSquareCategory(editingId.value, editForm.value)
        message.success('更新成功')
    }
    showEditModal.value = false
    fetchCategories()
}
const handleDelete = async (id: number) => {
    await deleteSquareCategory(id)
    message.success('删除成功')
    fetchCategories()
}

const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '分类名称', dataIndex: 'name', key: 'name', width: 140 },
    { title: '描述', dataIndex: 'description', key: 'description' },
    {
        title: '图片',
        dataIndex: 'image',
        key: 'image',
        width: 100,
        customRender: ({ record }: any) => {
            return record.image
                ? <img src={record.image} style="width: 48px; height: 48px; object-fit: cover; border-radius: 4px;" />
                : <span>-</span>
        }
    },
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
    {
        title: '创建时间',
        dataIndex: 'created_at',
        key: 'created_at',
        width: 160,
        customRender: ({ record }: any) => {
            return <div>{formatDate(record.created_at, 'time')}</div>
        }
    },
    {
        title: '操作',
        key: 'action',
        width: 140,
        customRender: ({ record }: any) => {
            return (
                <div>
                    <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
                    <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)}>
                        <Button type="link" danger>删除</Button>
                    </Popconfirm>
                </div>
            )
        }
    }
]

onMounted(fetchCategories)
</script>

<!-- 菜单广场分类管理页面，仅超级管理员可见 -->
<template>
    <div class="flex p-6 h-full bg-white rounded-xl shadow">
        <div class="flex-1 pl-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold text-white">广场分类管理</h2>
                <AButton type="primary" @click="handleCreate">新增分类</AButton>
            </div>
            <ATable :dataSource="categories" :loading="loading" rowKey="id" bordered :columns="columns">
            </ATable>
            <AModal v-model:open="showEditModal" :title="isCreate ? '新增分类' : '编辑分类'" @ok="handleSubmit">
                <AForm :model="editForm">
                    <AFormItem label="分类名称" required>
                        <AInput v-model:value="editForm.name" placeholder="如：家常菜" />
                    </AFormItem>
                    <AFormItem label="描述">
                        <AInput v-model:value="editForm.description" />
                    </AFormItem>
                    <AFormItem label="图片">
                        <AInput v-model:value="editForm.image" placeholder="图片URL" />
                    </AFormItem>
                    <AFormItem label="排序">
                        <AInputNumber v-model:value="editForm.sort" :min="0" style="width: 100%" />
                    </AFormItem>
                </AForm>
            </AModal>
        </div>
    </div>
</template>
