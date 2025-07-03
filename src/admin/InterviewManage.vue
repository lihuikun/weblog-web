<script setup lang="tsx">
import { ref, onMounted } from 'vue'
import { message, Button, Popconfirm, Tag } from 'ant-design-vue'
import { 
  getInterviewList, 
  deleteInterview, 
  updateInterview, 
  createInterview,
  Interview,
  CreateInterviewDto
} from '@/api/interview'
import { useDateFormatter } from '@/hooks/useDateFormatter'
import { 
  categoryOptions, 
  difficultyOptions, 
  difficultyMap, 
  premiumOptions 
} from '@/api/constants'

// 面试题列表数据
const interviews = ref<Interview[]>([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 编辑相关状态
const isEdit = ref(false)
const editingInterview = ref<Interview | null>(null)
const showModal = ref(false)
const formData = ref<Partial<CreateInterviewDto>>({
  title: '',
  question: '',
  answer: '',
  categoryId: 1,
  difficulty: 1,
  requirePremium: false
})

// 筛选条件
const categoryId = ref<number | undefined>(undefined)
const difficulty = ref<number | undefined>(undefined)
const requirePremium = ref<boolean | undefined>(undefined)

// 日期格式化hooks
const { formatDate } = useDateFormatter()

// 获取面试题列表
const fetchInterviews = async () => {
  loading.value = true
  try {
    const { data } = await getInterviewList({ 
      page: page.value, 
      pageSize: pageSize.value,
      categoryId: categoryId.value,
      difficulty: difficulty.value,
      requirePremium: requirePremium.value
    })
    interviews.value = data.list
    total.value = data.total
  } catch (error) {
    console.error('获取面试题列表失败:', error)
    message.error('获取面试题列表失败')
  } finally {
    loading.value = false
  }
}

// 删除面试题
const handleDelete = async (id: number) => {
  try {
    await deleteInterview(id)
    message.success('删除成功')
    fetchInterviews()
  } catch (error) {
    console.error('删除面试题失败:', error)
    message.error('删除面试题失败')
  }
}

// 打开编辑面试题表单
const handleEdit = (interview: Interview) => {
  isEdit.value = true
  editingInterview.value = interview
  formData.value = { 
    title: interview.title,
    question: interview.question,
    answer: interview.answer || '',
    categoryId: interview.categoryId,
    difficulty: interview.difficulty,
    requirePremium: interview.requirePremium
  }
  showModal.value = true
}

// 打开新建面试题表单
const handleAdd = () => {
  isEdit.value = false
  editingInterview.value = null
  formData.value = {
    title: '',
    question: '',
    answer: '',
    categoryId: 1,
    difficulty: 1,
    requirePremium: false
  }
  showModal.value = true
}

// 提交表单（创建或更新）
const handleSubmit = async () => {
  try {
    if (isEdit.value && editingInterview.value) {
      // 更新面试题
      await updateInterview(editingInterview.value.id, formData.value)
      message.success('更新成功')
    } else {
      // 创建面试题
      await createInterview(formData.value as CreateInterviewDto)
      message.success('创建成功')
    }
    showModal.value = false
    fetchInterviews()
  } catch (error) {
    console.error('操作失败:', error)
    message.error('操作失败')
  }
}

// 处理分页变化
const handlePageChange = (newPage: number, newPageSize: number) => {
  page.value = newPage
  pageSize.value = newPageSize
  fetchInterviews()
}

// 应用筛选
const handleFilter = () => {
  page.value = 1
  fetchInterviews()
}

// 重置筛选
const resetFilter = () => {
  categoryId.value = undefined
  difficulty.value = undefined
  requirePremium.value = undefined
  page.value = 1
  fetchInterviews()
}

// 表格列定义
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '标题', dataIndex: 'title', key: 'title', width: 200 },
  { 
    title: '内容', 
    dataIndex: 'question', 
    key: 'question',
    width: 300,
    customRender: ({ text }: { text: string }) => {
      return text?.length > 100 ? text.substring(0, 100) + '...' : text
    }
  },
  {
    title: '分类',
    dataIndex: 'categoryId',
    key: 'categoryId',
    width: 120,
    customRender: ({ record }: { record: Interview }) => {
      return (
        <div>
          {record.category?.name || `分类${record.categoryId}`}
        </div>
      )
    }
  },
  {
    title: '难度',
    dataIndex: 'difficulty',
    key: 'difficulty',
    width: 100,
    customRender: ({ record }: { record: Interview }) => {
      const difficulty = difficultyMap[record.difficulty as keyof typeof difficultyMap] || { color: 'default', text: '未知' }
      
      return (
        <Tag color={difficulty.color}>{difficulty.text}</Tag>
      )
    }
  },
  {
    title: '会员专属',
    dataIndex: 'requirePremium',
    key: 'requirePremium',
    width: 100,
    customRender: ({ record }: { record: Interview }) => {
      return (
        <Tag color={record.requirePremium ? 'gold' : 'default'}>
          {record.requirePremium ? '会员专属' : '所有用户'}
        </Tag>
      )
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 170,
    customRender: ({ record }: { record: Interview }) => {
      return <div>{formatDate(record.createTime, 'time')}</div>
    }
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 170,
    customRender: ({ record }: { record: Interview }) => {
      return <div>{formatDate(record.updateTime, 'time')}</div>
    }
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
    customRender: ({ record }: { record: Interview }) => {
      return (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确定删除？"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </div>
      )
    }
  }
]

// 组件挂载时加载数据
onMounted(fetchInterviews)
</script>

<template>
    <div class="flex p-6 h-full bg-white rounded-xl shadow">
        <div class="flex-1">
            <h2 class="mb-4 text-xl font-bold text-white">面试题管理</h2>

            <!-- 筛选区域 -->
            <div class="p-4 mb-4 bg-gray-50 rounded-md">
                <div class="flex flex-wrap gap-4 items-center">
                    <div class="flex items-center">
                        <ASelect v-model:value="categoryId" style="width: 160px" placeholder="选择分类"
                            :options="categoryOptions" allowClear />
                    </div>

                    <div class="flex items-center">
                        <ASelect v-model:value="difficulty" style="width: 120px" placeholder="选择难度"
                            :options="difficultyOptions" allowClear />
                    </div>
                    
                    <div class="flex items-center">
                        <ASelect v-model:value="requirePremium" style="width: 120px" placeholder="会员筛选"
                            :options="premiumOptions" allowClear />
                    </div>

                    <AButton type="primary" @click="handleFilter">筛选</AButton>
                    <AButton @click="resetFilter">重置</AButton>
                    <AButton type="primary" @click="handleAdd">新增面试题</AButton>
                </div>
            </div>

            <!-- 表格 -->
            <ATable :dataSource="interviews" :columns="columns" :loading="loading" rowKey="id" bordered
                :scroll="{ x: true }" :pagination="{
          current: page,
          pageSize: pageSize,
          total: total,
          onChange: handlePageChange
        }" />

            <!-- 编辑/新增弹窗 -->
            <AModal v-model:open="showModal" :title="isEdit ? '编辑面试题' : '新增面试题'" @ok="handleSubmit" width="800px">
                <AForm :model="formData" layout="vertical">
                    <AFormItem label="标题" required>
                        <AInput v-model:value="formData.title" placeholder="请输入标题" />
                    </AFormItem>

                    <AFormItem label="分类" required>
                        <ASelect v-model:value="formData.categoryId" :options="categoryOptions" placeholder="请选择分类" />
                    </AFormItem>

                    <AFormItem label="难度" required>
                        <ASelect v-model:value="formData.difficulty" :options="difficultyOptions" placeholder="请选择难度" />
                    </AFormItem>

                    <AFormItem label="问题内容" required>
                        <ATextarea v-model:value="formData.question" :rows="5" placeholder="请输入问题内容" />
                    </AFormItem>

                    <AFormItem label="答案" required>
                        <ATextarea v-model:value="formData.answer" :rows="8" placeholder="请输入答案" />
                    </AFormItem>
                    <AFormItem label="会员专属" required>
                        <ASwitch v-model:checked="formData.requirePremium" />
                    </AFormItem>
                </AForm>
            </AModal>
        </div>
    </div>
</template> 