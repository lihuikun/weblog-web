<script setup lang="tsx">
import { ref, onMounted, computed } from 'vue'
import { message, Button, Select, Popconfirm } from 'ant-design-vue'
import { getSquareMenuList, updateSquareMenuCategory } from '@/api/menu'
import { getSquareCategoryList } from '@/api/squareCategory'
import { useUserStore } from '@/stores/userStore'
import { useDateFormatter } from '@/hooks/useDateFormatter'

const userStore = useUserStore()
const isAdmin = computed(() => userStore.hasRole('admin'))

const menus = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const keyword = ref('')
const selectedCategoryId = ref<number | undefined>(undefined)
const squareCategories = ref<any[]>([])
const { formatDate } = useDateFormatter()

const showCategoryModal = ref(false)
const editingMenu = ref<any>(null)
const selectedSquareCategory = ref<number | undefined>(undefined)

const fetchSquareCategories = async () => {
    const { data } = await getSquareCategoryList()
    squareCategories.value = data
}

const fetchMenus = async () => {
    loading.value = true
    const { data } = await getSquareMenuList({
        page: page.value,
        pageSize: pageSize.value,
        keyword: keyword.value || undefined,
        squareCategoryId: selectedCategoryId.value,
    })
    menus.value = data.list
    total.value = data.total
    loading.value = false
}

const handleSearch = () => {
    page.value = 1
    fetchMenus()
}

const handlePageChange = (p: number) => {
    page.value = p
    fetchMenus()
}

const handleCategoryChange = () => {
    page.value = 1
    fetchMenus()
}

const openEditCategory = (menu: any) => {
    editingMenu.value = menu
    selectedSquareCategory.value = menu.squareCategoryId
    showCategoryModal.value = true
}

const handleUpdateCategory = async () => {
    if (!editingMenu.value || selectedSquareCategory.value === undefined) return
    await updateSquareMenuCategory(editingMenu.value.id, { squareCategoryId: selectedSquareCategory.value })
    message.success('修改成功')
    showCategoryModal.value = false
    fetchMenus()
}

const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '菜名', dataIndex: 'title', key: 'title', width: 160 },
    {
        title: '广场分类',
        dataIndex: 'squareCategoryId',
        key: 'squareCategoryId',
        width: 120,
        customRender: ({ record }: any) => {
            const cat = squareCategories.value.find((c: any) => c.id === record.squareCategoryId)
            return <span>{cat?.name || '未分类'}</span>
        }
    },
    {
        title: '分享者',
        key: 'user',
        width: 120,
        customRender: ({ record }: any) => {
            return <span>{record.user?.nickname || '未知用户'}</span>
        }
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 160,
        customRender: ({ record }: any) => {
            return <div>{formatDate(record.createTime, 'time')}</div>
        }
    },
    {
        title: '操作',
        key: 'action',
        width: 120,
        customRender: ({ record }: any) => {
            return (
                <div>
                    {isAdmin.value && (
                        <Button type="link" onClick={() => openEditCategory(record)}>修改分类</Button>
                    )}
                </div>
            )
        }
    }
]

onMounted(() => {
    fetchSquareCategories()
    fetchMenus()
})
</script>

<template>
    <div class="flex p-6 h-full bg-white rounded-xl shadow">
        <div class="flex-1 pl-6">
            <h2 class="mb-4 text-xl font-bold text-white">广场菜单管理</h2>
            <div class="flex gap-3 mb-4 items-center">
                <AInput v-model:value="keyword" placeholder="菜名关键词" style="width: 200px" />
                <ASelect v-model:value="selectedCategoryId" placeholder="广场分类" allowClear
                    style="width: 160px" @change="handleCategoryChange">
                    <ASelectOption v-for="cat in squareCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</ASelectOption>
                </ASelect>
                <AButton type="primary" @click="handleSearch">查询</AButton>
            </div>
            <ATable :dataSource="menus" :loading="loading" rowKey="id" bordered :columns="columns"
                :pagination="{ current: page, pageSize, total, onChange: handlePageChange }">
            </ATable>
            <AModal v-model:open="showCategoryModal" title="修改广场分类" @ok="handleUpdateCategory">
                <ASelect v-model:value="selectedSquareCategory" placeholder="选择广场分类" style="width: 100%">
                    <ASelectOption v-for="cat in squareCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</ASelectOption>
                </ASelect>
            </AModal>
        </div>
    </div>
</template>
