<script setup lang="tsx">
import { ref, onMounted } from 'vue'
import { message, Button, Popconfirm, Tag, Switch, Upload, Tooltip } from 'ant-design-vue'
import { UploadOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { 
  getResumeTemplateList, 
  deleteResumeTemplate, 
  updateResumeTemplate,
  createResumeTemplate 
} from '@/api/resumeTemplate'
import { useDateFormatter } from '@/hooks/useDateFormatter'
import { uploadFile } from '@/utils/upload'
import type { ResumeTemplate, CreateResumeTemplateRequest, UpdateResumeTemplateRequest } from '@/types/resumeTemplate'

const templates = ref<ResumeTemplate[]>([])
const loading = ref(false)
const editingTemplate = ref<ResumeTemplate | null>(null)
const showEditModal = ref(false)
const showCreateModal = ref(false)
const editForm = ref<CreateResumeTemplateRequest>({
  name: '',
  previewImageUrl: '',
  downloadUrl: '',
  isPremium: false
})

// 上传状态
const previewImageUploading = ref(false)
const downloadFileUploading = ref(false)
const previewImageUrl = ref('')
const downloadFileUrl = ref('')

// 隐藏的上传组件引用
const hiddenPreviewUpload = ref()
const hiddenPreviewUploadCreate = ref()

// 日期格式化hooks
const { formatDate } = useDateFormatter()

const fetchTemplates = async () => {
  loading.value = true
  try {
    const { data } = await getResumeTemplateList()
    templates.value = data
  } catch (error) {
    message.error('获取简历模板列表失败')
  } finally {
    loading.value = false
  }
}

const handleDelete = async (id: number) => {
  try {
    await deleteResumeTemplate(id)
    message.success('删除成功')
    fetchTemplates()
  } catch (error) {
    message.error('删除失败')
  }
}

const handleEdit = (template: ResumeTemplate) => {
  editingTemplate.value = template
  editForm.value = { 
    name: template.name,
    previewImageUrl: template.previewImageUrl,
    downloadUrl: template.downloadUrl,
    isPremium: template.isPremium
  }
  
  // 设置文件URL
  previewImageUrl.value = template.previewImageUrl || ''
  downloadFileUrl.value = template.downloadUrl || ''
  
  showEditModal.value = true
}

const handleCreate = () => {
  editForm.value = {
    name: '',
    previewImageUrl: '',
    downloadUrl: '',
    isPremium: false
  }
  
  // 清空文件URL
  previewImageUrl.value = ''
  downloadFileUrl.value = ''
  
  showCreateModal.value = true
}

const handleUpdate = async () => {
  if (!editingTemplate.value) return
  
  try {
    await updateResumeTemplate(editingTemplate.value.id, editForm.value)
    message.success('更新成功')
    showEditModal.value = false
    fetchTemplates()
  } catch (error) {
    message.error('更新失败')
  }
}

const handleCreateSubmit = async () => {
  try {
    await createResumeTemplate(editForm.value)
    message.success('创建成功')
    showCreateModal.value = false
    fetchTemplates()
  } catch (error) {
    message.error('创建失败')
  }
}

// 预览图上传处理
const handlePreviewImageUpload = async (info: any) => {
  if (info.file.status === 'uploading') {
    previewImageUploading.value = true
    return
  }
  
  if (info.file.status === 'done') {
    previewImageUploading.value = false
    editForm.value.previewImageUrl = info.file.response.url
    previewImageUrl.value = info.file.response.url
    message.success('预览图上传成功')
  } else if (info.file.status === 'error') {
    previewImageUploading.value = false
    message.error('预览图上传失败')
  }
}

// 下载文件上传处理
const handleDownloadFileUpload = async (info: any) => {
  if (info.file.status === 'uploading') {
    downloadFileUploading.value = true
    return
  }
  
  if (info.file.status === 'done') {
    downloadFileUploading.value = false
    editForm.value.downloadUrl = info.file.response.url
    downloadFileUrl.value = info.file.response.url
    message.success('文件上传成功')
  } else if (info.file.status === 'error') {
    downloadFileUploading.value = false
    message.error('文件上传失败')
  }
}

// 自定义上传函数
const customUpload = async (options: any) => {
  const { file, onSuccess, onError } = options
  console.log('1213', 1213)
  try {
    const result = await uploadFile(file, { path: 'word' })
    onSuccess(result)
  } catch (error) {
    onError(error)
  }
}

const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { 
    title: '模板名称', 
    dataIndex: 'name', 
    key: 'name', 
    width: 200,
    customRender: ({ record }: { record: ResumeTemplate }) => (
      <div class="font-medium text-gray-800">
        {record.name}
      </div>
    )
  },
  { 
    title: '预览图', 
    dataIndex: 'previewImageUrl', 
    key: 'previewImageUrl', 
    width: 120,
    customRender: ({ record }: { record: ResumeTemplate }) => (
      <div>
        {record.previewImageUrl ? (
          <img 
            src={record.previewImageUrl} 
            alt="预览图" 
            class="object-cover w-16 h-12 rounded border"
            onError={(e: any) => {
              e.target.style.display = 'none'
            }}
          />
        ) : (
          <div class="flex justify-center items-center w-16 h-12 text-xs text-gray-400 bg-gray-100 rounded border">
            无图片
          </div>
        )}
      </div>
    )
  },
  { 
    title: '下载链接', 
    dataIndex: 'downloadUrl', 
    key: 'downloadUrl', 
    width: 280,
      customRender: ({ record }: { record: ResumeTemplate }) => (
        <div class="truncate w-70">
         <Tooltip title={record.downloadUrl} placement="top">
          <a 
            href={record.downloadUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-blue-500 hover:text-blue-700"
          >
            {record.downloadUrl}
          </a>
         </Tooltip>
        </div>
      )
  },
  {
    title: '是否付费',
    dataIndex: 'isPremium',
    key: 'isPremium',
    width: 100,
    customRender: ({ record }: { record: ResumeTemplate }) => (
      <Tag color={record.isPremium ? 'gold' : 'green'}>
        {record.isPremium ? '付费' : '免费'}
      </Tag>
    )
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 120,
    customRender: ({ record }: { record: ResumeTemplate }) => (
      <div>
        {record.createTime ? formatDate(record.createTime, 'time') : '-'}
      </div>
    )
  },
  {
    title: '更新时间',
    dataIndex: 'updatedTime',
    key: 'updatedTime',
    width: 120,
    customRender: ({ record }: { record: ResumeTemplate }) => (
      <div>
        {record.updatedTime ? formatDate(record.updatedTime, 'time') : '-'}
      </div>
    )
  },
  {
    title: '操作',
    key: 'action',
    width: 140,
    customRender: ({ record }: { record: ResumeTemplate }) => {
      return (
        <div>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Popconfirm 
            title="确定删除？" 
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="link" danger>
              删除
            </Button>
          </Popconfirm>
        </div>
      )
    }
  }
]

onMounted(fetchTemplates)
</script>

<!-- 简历模板管理页面，配合后台管理布局使用 -->
<template>
  <div class="flex p-6 h-full bg-white rounded-xl shadow">
    <!-- 右侧内容区 -->
    <div class="flex-1 pl-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold text-gray-800">简历模板管理</h2>
        <Button type="primary" @click="handleCreate">
          新增模板
        </Button>
      </div>

      <ATable :dataSource="templates" :loading="loading" rowKey="id" bordered :columns="columns" :scroll="{ x: true }"
        class="w-full" />

      <!-- 编辑弹窗 -->
      <AModal v-model:open="showEditModal" title="编辑简历模板" @ok="handleUpdate" width="600px">
        <AForm :model="editForm" layout="vertical">
          <AFormItem label="模板名称" required>
            <AInput v-model:value="editForm.name" placeholder="请输入模板名称" />
          </AFormItem>
          <AFormItem label="预览图" required>
            <div v-if="previewImageUrl" class="inline-block relative">
              <img :src="previewImageUrl" alt="预览图"
                class="object-cover w-32 h-24 rounded border transition-opacity cursor-pointer hover:opacity-80"
                @click="() => hiddenPreviewUpload.value?.$el.querySelector('input[type=file]')?.click()" />
              <span
                class="flex absolute -top-2 -right-2 z-10 justify-center items-center w-[16px] h-[16px] bg-red-500 rounded-[50%] text-[#fff]"
                @click.stop="previewImageUrl = ''; editForm.previewImageUrl = ''">x
              </span>
            </div>
            <AUpload v-if="!previewImageUrl" :custom-request="customUpload" :on-change="handlePreviewImageUpload"
              :show-upload-list="false" accept="image/*">
              <Button :loading="previewImageUploading">上传预览图</Button>
            </AUpload>
            <!-- 隐藏的上传组件，用于点击图片时触发 -->
            <AUpload ref="hiddenPreviewUpload" v-show="false" :custom-request="customUpload"
              :on-change="handlePreviewImageUpload" :show-upload-list="false" accept="image/*" />
          </AFormItem>
          <AFormItem label="下载文件" required>
            <div v-if="downloadFileUrl" class="relative p-3 bg-gray-50 rounded border">
              <div class="pr-8">
                <Tooltip :title="downloadFileUrl.split('/').pop()" placement="top">
                  <a :href="downloadFileUrl" target="_blank" class="block text-blue-500 truncate hover:text-blue-700">{{
                    downloadFileUrl.split('/').pop() }}</a>
                </Tooltip>
              </div>
              <span
                class="flex absolute -top-2 -right-2 z-10 justify-center items-center w-[16px] h-[16px] bg-red-500 rounded-[50%] text-[#fff]"
                @click.stop="downloadFileUrl = ''; editForm.downloadUrl = ''">x
              </span>
            </div>
            <AUpload v-if="!downloadFileUrl" :custom-request="customUpload" :on-change="handleDownloadFileUpload"
              :show-upload-list="false" accept=".zip,.doc,.docx,.pdf">
              <Button :loading="downloadFileUploading">
                <UploadOutlined />
                上传文件
              </Button>
            </AUpload>
          </AFormItem>
          <AFormItem label="是否付费">
            <Switch v-model:checked="editForm.isPremium" />
            <span class="ml-2 text-gray-500">开启后为付费模板</span>
          </AFormItem>
        </AForm>
      </AModal>

      <!-- 新增弹窗 -->
      <AModal v-model:open="showCreateModal" title="新增简历模板" @ok="handleCreateSubmit" width="600px">
        <AForm :model="editForm" layout="vertical">
          <AFormItem label="模板名称" required>
            <AInput v-model:value="editForm.name" placeholder="请输入模板名称" />
          </AFormItem>
          <AFormItem label="预览图" required>
            <div v-if="previewImageUrl" class="inline-block relative">
              <img :src="previewImageUrl" alt="预览图"
                class="object-cover w-32 h-24 rounded border transition-opacity cursor-pointer hover:opacity-80"
                @click="() => hiddenPreviewUploadCreate.value?.$el.querySelector('input[type=file]')?.click()" />
              <Button type="text" danger size="small"
                class="flex absolute -top-2 -right-2 z-10 justify-center items-center p-0 w-6 h-6 text-white bg-red-500 rounded-full border-0 min-w-6 hover:bg-red-600"
                @click.stop="previewImageUrl = ''; editForm.previewImageUrl = ''">
                <CloseOutlined class="text-xs" />
              </Button>
            </div>
            <AUpload v-if="!previewImageUrl" :custom-request="customUpload" :on-change="handlePreviewImageUpload"
              :show-upload-list="false" accept="image/*">
              <Button :loading="previewImageUploading">上传预览图</Button>
            </AUpload>
            <!-- 隐藏的上传组件，用于点击图片时触发 -->
            <AUpload ref="hiddenPreviewUploadCreate" v-show="false" :custom-request="customUpload"
              :on-change="handlePreviewImageUpload" :show-upload-list="false" accept="image/*" />
          </AFormItem>
          <AFormItem label="下载文件" required>
            <div v-if="downloadFileUrl" class="relative p-3 bg-gray-50 rounded border">
              <div class="pr-8 w-44">
                <Tooltip :title="downloadFileUrl.split('/').pop()" placement="top">
                  <a :href="downloadFileUrl" target="_blank" class="block text-blue-500 truncate hover:text-blue-700">{{
                    downloadFileUrl.split('/').pop() }}</a>
                </Tooltip>
              </div>
              <Button type="text" danger size="small"
                class="flex absolute top-1 right-1 z-10 justify-center items-center p-0 w-6 h-6 text-white bg-red-500 rounded-full border-0 min-w-6 hover:bg-red-600"
                @click="downloadFileUrl = ''; editForm.downloadUrl = ''">
                <CloseOutlined class="text-xs" />
              </Button>
            </div>
            <AUpload v-if="!downloadFileUrl" :custom-request="customUpload" :on-change="handleDownloadFileUpload"
              :show-upload-list="false" accept=".zip,.doc,.docx,.pdf">
              <Button :loading="downloadFileUploading">
                <UploadOutlined />
                上传文件
              </Button>
            </AUpload>
          </AFormItem>
          <AFormItem label="是否付费">
            <Switch v-model:checked="editForm.isPremium" />
            <span class="ml-2 text-gray-500">开启后为付费模板</span>
          </AFormItem>
        </AForm>
      </AModal>
    </div>
  </div>
</template>
