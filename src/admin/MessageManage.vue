<script setup lang="tsx">
import { ref, onMounted } from 'vue'
import { message, Button, Popconfirm, Tag } from 'ant-design-vue'
import { getAllMessages, updateMessage, deleteMessage, Message, UpdateMessageDto } from '@/api/message'
import { useDateFormatter } from '@/hooks/useDateFormatter'

// 日期格式化
const { formatDate } = useDateFormatter()

// 表格数据
const dataSource = ref<Message[]>([])
const loading = ref(false)
const total = ref(0)

// 分页配置
const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`
})

// 筛选条件
const filters = ref({
    type: undefined as string | undefined
})

// 消息类型选项
const messageTypeOptions = [
    { label: '全部', value: undefined },
    { label: '系统消息', value: 'system' },
    { label: '通知消息', value: 'notification' }
]

// 编辑对话框
const editModalVisible = ref(false)
const editForm = ref<UpdateMessageDto>({})
const editingMessageId = ref<number | null>(null)

// 获取消息类型标签颜色
const getTypeTagColor = (type: string) => {
    return type === 'system' ? 'blue' : 'green'
}

// 获取消息类型标签文本
const getTypeTagText = (type: string) => {
    return type === 'system' ? '系统消息' : '通知消息'
}

// 打开编辑对话框
const handleEdit = (record: any) => {
    editingMessageId.value = record.id
    editForm.value = {
        title: record.title,
        content: record.content,
        type: record.type,
        isRead: record.isRead
    }
    editModalVisible.value = true
}

// 删除消息
const handleDelete = async (id: number) => {
    try {
        await deleteMessage(id)
        message.success('删除成功')
        fetchMessages()
    } catch (error) {
        console.error('删除失败:', error)
        message.error('删除失败')
    }
}

// 表格列配置
const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80
    },
    {
        title: '内容',
        dataIndex: 'content',
        key: 'content',
        width: 300,
        ellipsis: true
    },
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 100,
        customRender: ({ record }: { record: Message }) => (
            <Tag color={getTypeTagColor(record.type)}>
                {getTypeTagText(record.type)}
            </Tag>
        )
    },
    {
        title: '用户',
        dataIndex: 'user',
        key: 'user',
        width: 150,
        customRender: ({ record }: { record: Message }) => (
            <span class={record.sender ? 'text-gray-700' : 'text-gray-400'}>
                {record.sender?.nickname}
            </span>
        )
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 180,
        customRender: ({ record }: { record: Message }) => (
            <span class="text-gray-600">
                {formatDate(record.createdAt, 'time')}
            </span>
        )
    },
    {
        title: '操作',
        key: 'action',
        width: 150,
        fixed: 'right',
        customRender: ({ record }: { record: Message }) => (
            <div>
                <Button
                    type="link"
                    size="small"
                    onClick={() => handleEdit(record)}
                    class="text-blue-600 hover:text-blue-800"
                >
                    编辑
                </Button>
                <Popconfirm
                    title="确定要删除这条消息吗？"
                    onConfirm={() => handleDelete(record.id)}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button
                        type="link"
                        size="small"
                        danger
                        class="text-red-600 hover:text-red-800"
                    >
                        删除
                    </Button>
                </Popconfirm>
            </div>
        )
    }
]

// 获取消息列表
const fetchMessages = async () => {
    loading.value = true
    try {
        const res = await getAllMessages({
            page: pagination.value.current,
            pageSize: pagination.value.pageSize,
            type: filters.value.type
        })

        dataSource.value = res.data.list || []
        total.value = res.data.total || 0
        pagination.value.total = total.value
    } catch (error) {
        console.error('获取消息列表失败:', error)
        message.error('获取消息列表失败')
    } finally {
        loading.value = false
    }
}

// 分页变化
const handleTableChange = (pag: any) => {
    pagination.value.current = pag.current
    pagination.value.pageSize = pag.pageSize
    fetchMessages()
}

// 筛选变化
const handleFilterChange = () => {
    pagination.value.current = 1
    fetchMessages()
}

// 保存编辑
const handleSaveEdit = async () => {
    if (editingMessageId.value) {
        await updateMessage(editingMessageId.value, editForm.value)
        message.success('更新成功')
        editModalVisible.value = false
        fetchMessages()
    }
}

// 取消编辑
const handleCancelEdit = () => {
    editModalVisible.value = false
    editForm.value = {}
    editingMessageId.value = null
}

onMounted(() => {
    fetchMessages()
})
</script>

<template>
    <div class="flex p-6 h-full bg-white rounded-xl shadow">
        <div class="flex-1">
            <h2 class="mb-4 text-xl font-bold text-gray-800">消息管理</h2>

            <!-- 筛选区域 -->
            <div class="p-4 mb-4 bg-gray-50 rounded-md">
                <ASpace>
                    <span class="text-gray-600">消息类型：</span>
                    <ASelect v-model:value="filters.type" :options="messageTypeOptions" class="w-40"
                        @change="handleFilterChange" />
                    <AButton @click="fetchMessages">刷新</AButton>
                </ASpace>
            </div>

            <!-- 表格 -->
            <div class="w-full">
                <ATable :dataSource="dataSource" :columns="columns" :loading="loading" :pagination="pagination"
                    :scroll="{ x: true }" rowKey="id" bordered @change="handleTableChange" class="w-full" />
            </div>

            <!-- 编辑对话框 -->
            <AModal v-model:open="editModalVisible" title="编辑消息" @ok="handleSaveEdit" @cancel="handleCancelEdit">
                <AForm :model="editForm">
                    <AFormItem label="内容">
                        <ATextarea v-model:value="editForm.content" placeholder="请输入内容" :rows="4" />
                    </AFormItem>

                    <AFormItem label="类型">
                        <ASelect v-model:value="editForm.type" placeholder="请选择类型" :options="[
                            { label: '系统消息', value: 'system' },
                            { label: '通知消息', value: 'notification' }
                        ]" />
                    </AFormItem>
                </AForm>
            </AModal>
        </div>
    </div>
</template>