<script setup lang="tsx">
import { ref, onMounted } from 'vue'
import { message, Button, Popconfirm } from 'ant-design-vue'
import { getGuestbookList, deleteGuestbook, createGuestbook } from '@/api/guestbook'
import type { Guestbook, CreateGuestbookDto } from '@/api/guestbook'
import { useDateFormatter } from '@/hooks/useDateFormatter'

const guestbooks = ref<Guestbook[]>([])
const loading = ref(false)
const keyword = ref('')
const showAddModal = ref(false)
const addForm = ref<CreateGuestbookDto>({
    avatarUrl: '',
    nickname: '',
    content: ''
})

// 日期格式化hooks
const { formatDate } = useDateFormatter()

// 获取留言列表
const fetchGuestbooks = async () => {
    loading.value = true
    try {
        const { data } = await getGuestbookList()
        guestbooks.value = data.list
    } catch (error) {
        console.error('获取留言列表失败:', error)
        message.error('获取留言列表失败')
    } finally {
        loading.value = false
    }
}

// 处理搜索
const handleSearch = () => {
    if (!keyword.value) {
        fetchGuestbooks()
        return
    }
    
    const filtered = guestbooks.value.filter(item => 
        item.nickname.includes(keyword.value) ||
        item.content.includes(keyword.value) ||
        item.avatarUrl?.includes(keyword.value)
    )
    guestbooks.value = filtered
}

// 处理新增
const handleAdd = () => {
    addForm.value = {
        nickname: '',
        avatarUrl: '',
        content: ''
    }
    showAddModal.value = true
}

// 确认创建留言
const handleCreate = async () => {
    if (!addForm.value.nickname  || !addForm.value.content) {
        message.error('请填写昵称和留言内容')
        return
    }
    
    try {
        await createGuestbook(addForm.value)
        message.success('创建成功')
        showAddModal.value = false
        fetchGuestbooks()
    } catch (error) {
        console.error('创建失败:', error)
        message.error('创建失败')
    }
}

// 处理删除
const handleDelete = async (id: number) => {
    try {
        await deleteGuestbook(id)
        message.success('删除成功')
        fetchGuestbooks()
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
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        width: 120
    },
    {
        title: '头像',
        dataIndex: 'avatarUrl',
        key: 'avatarUrl',
        width: 180,
        customRender: ({ record }: { record: Guestbook }) => (
            <div class="line-clamp-2">
                {record.avatarUrl ? <img src={record.avatarUrl} alt="头像" class="w-10 h-10 rounded-full" /> : '无头像'}
            </div>
        )
    },
    {
        title: '留言内容',
        dataIndex: 'content',
        key: 'content',
        width: 300,
        customRender: ({ record }: { record: Guestbook }) => (
            <div class="line-clamp-2">
                {record.content}
            </div>
        )
    },
    {
        title: 'IP地址',
        dataIndex: 'ip',
        key: 'ip',
        width: 130
    },
    {
        title: '创建时间',
        dataIndex: 'updatedTime',
        key: 'updatedTime',
        width: 180,
        customRender: ({ record }: { record: Guestbook }) => (
            <div>
                {formatDate(record.updatedTime, 'time')}
            </div>
        )
    },
    {
        title: '操作',
        key: 'action',
        width: 100,
        fixed: 'right',
        customRender: ({ record }: { record: Guestbook }) => (
            <div>
                <Popconfirm 
                    title="确定删除？" 
                    onConfirm={() => handleDelete(record.id)}
                >
                    <Button type="link" danger>删除</Button>
                </Popconfirm>
            </div>
        )
    }
]

onMounted(fetchGuestbooks)
</script>

<template>
    <div class="flex p-6 h-full bg-white rounded-xl shadow">
        <div class="flex-1">
            <h2 class="mb-4 text-xl font-bold text-white">留言板管理</h2>
            
            <!-- 搜索框和操作按钮 -->
            <div class="flex justify-between mb-4">
                <div class="flex">
                    <AInput 
                        v-model:value="keyword" 
                        placeholder="请输入昵称、邮箱或内容搜索" 
                        class="mr-2 w-64"
                        allowClear
                        @pressEnter="handleSearch"
                    />
                    <AButton type="primary" @click="handleSearch">搜索</AButton>
                    <AButton class="ml-2" @click="() => { keyword = ''; fetchGuestbooks() }">
                        重置
                    </AButton>
                </div>
                <AButton type="primary" @click="handleAdd">新增</AButton>
            </div>
            
            <!-- 表格 -->
            <ATable 
                :dataSource="guestbooks" 
                :loading="loading" 
                rowKey="id" 
                bordered 
                :columns="columns"
                :scroll="{ x: true }"
            >
            </ATable>
            
            <!-- 新增留言弹窗 -->
            <AModal v-model:open="showAddModal" title="新增留言" @ok="handleCreate">
                <AForm :model="addForm">
                    <AFormItem label="昵称" required>
                        <AInput v-model:value="addForm.nickname" placeholder="请输入昵称" />
                    </AFormItem>
                    <AFormItem label="头像">
                        <AInput v-model:value="addForm.avatarUrl" placeholder="请输入头像（选填）" />
                    </AFormItem>
                    <AFormItem label="留言内容" required>
                        <ATextarea 
                            v-model:value="addForm.content" 
                            placeholder="请输入留言内容" 
                            :rows="4"
                        />
                    </AFormItem>
                </AForm>
            </AModal>
        </div>
    </div>
</template>
