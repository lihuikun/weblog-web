<script setup lang="tsx">
import { ref, onMounted } from 'vue'
import { message, Button, Popconfirm } from 'ant-design-vue'
import { getUserList, deleteUser, updateUserPartial } from '@/api/user'
const users = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const editingUser = ref<any>(null)
const showEditModal = ref(false)
const editForm = ref<any>({})

const fetchUsers = async () => {
    loading.value = true
    const { data } = await getUserList({ page: page.value, pageSize: pageSize.value })
    users.value = data.list
    total.value = data.total
    loading.value = false
}
const handleDelete = async (id: number) => {
    await deleteUser(id)
    message.success('删除成功')
    fetchUsers()
}
const handleEdit = (user: any) => {
    editingUser.value = user
    editForm.value = { ...user }
    showEditModal.value = true
}
const handleUpdate = async () => {
    if (!editingUser.value) return
    await updateUserPartial(editingUser.value.id, editForm.value)
    message.success('更新成功')
    showEditModal.value = false
    fetchUsers()
}
const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '用户名', dataIndex: 'nickname', key: 'nickname', width: 120 },
    { title: '邮箱', dataIndex: 'email', key: 'email', width: 180 },
    {
        title: '权限',
        dataIndex: 'role',
        key: 'role',
        width: 120,
        customRender: ({ record }: any) => {
            return (
                <div>
                    {roleList.find((item: any) => item.value === record.role)?.label}
                </div>
            )
        }
    },
    {
        title: '操作',
        key: 'action',
        width: 140,
        customRender: ({ record }: any) => {
            return (
                <div>
                    <Button type="link" onClick={() => handleEdit(record)
                    }> 编辑 </Button>
                    <Popconfirm title="确定删除？" onConfirm={() => handleDelete(record.id)
                    }>
                        <Button type="link" danger > 删除 </Button>
                    </Popconfirm>
                </div>
            )
        }
    }
]
const roleList = [
    {
        value: 'admin',
        label: '超级管理员',
    }, {
        value: 'subAdmin',
        label: '子管理员',
    }, {
        value: 'user',
        label: '用户',
    },
]
onMounted(fetchUsers)
</script>

<!-- 用户管理页面，配合后台管理布局使用 -->
<template>
    <div class="flex p-6 h-full bg-white rounded-xl shadow">
        <!-- 右侧内容区 -->
        <div class="flex-1 pl-6">
            <h2 class="mb-4 text-xl font-bold text-white">用户管理</h2>
            <ATable :dataSource="users" :loading="loading" rowKey="id" bordered :columns="columns">
            </ATable>
            <!-- 编辑弹窗 -->
            <AModal v-model:open="showEditModal" title="编辑用户" @ok="handleUpdate">
                <AForm :model="editForm">
                    <AFormItem label="昵称">
                        <AInput v-model:value="editForm.nickname" />
                    </AFormItem>
                    <AFormItem label="邮箱">
                        <AInput v-model:value="editForm.email" />
                    </AFormItem>
                    <AFormItem label="角色">
                        <ASelect v-model:value="editForm.role" :options="roleList">
                        </ASelect>
                    </AFormItem>
                </AForm>
            </AModal>
        </div>
    </div>
</template>