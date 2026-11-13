<script setup lang="tsx">
import { computed, onMounted, ref } from 'vue'
import { message, Button, Switch } from 'ant-design-vue'
import {
  getFeatureConfigManage,
  updateFeatureConfigManage,
  type AppFeatureConfigManage,
} from '@/api/featureSwitch'
import { useDateFormatter } from '@/hooks/useDateFormatter'

const loading = ref(false)
const saving = ref(false)
const enabled = ref(false)
const config = ref<Record<string, unknown>>({})
const updatedTime = ref<string | undefined>()
const showKeyModal = ref(false)
const showFullModal = ref(false)
const editingKey = ref('')
const keyJsonText = ref('true')
const fullJsonText = ref('{}')
const { formatDate } = useDateFormatter()

const featureRows = computed(() =>
  Object.entries(config.value).map(([key, value]) => ({
    key,
    enabled: value !== false,
    value,
  })),
)

const fetchConfig = async () => {
  loading.value = true
  try {
    const res = await getFeatureConfigManage()
    const data = (res.data ?? {}) as AppFeatureConfigManage
    enabled.value = !!data.enabled
    config.value =
      data.config && typeof data.config === 'object' && !Array.isArray(data.config)
        ? { ...data.config }
        : {}
    updatedTime.value = data.updatedTime
  } finally {
    loading.value = false
  }
}

const persist = async (patch: {
  enabled?: boolean
  config?: Record<string, unknown>
}) => {
  saving.value = true
  try {
    await updateFeatureConfigManage(patch)
    message.success('已保存')
    await fetchConfig()
  } finally {
    saving.value = false
  }
}

const onMasterEnabled = async (checked: boolean) => {
  enabled.value = checked
  await persist({ enabled: checked, config: config.value })
}

const onRowEnabled = async (key: string, checked: boolean) => {
  const next = { ...config.value }
  if (checked) {
    const prev = next[key]
    next[key] =
      prev !== false && prev !== null && typeof prev === 'object' && !Array.isArray(prev)
        ? prev
        : true
  } else {
    next[key] = false
  }
  config.value = next
  await persist({ config: next })
}

const openKeyEditor = (key: string, value: unknown) => {
  editingKey.value = key
  keyJsonText.value = JSON.stringify(value, null, 2)
  showKeyModal.value = true
}

const submitKeyJson = async () => {
  let parsed: unknown
  try {
    parsed = JSON.parse(keyJsonText.value || 'true')
  } catch {
    message.error('JSON 格式不正确')
    return
  }
  const next = { ...config.value, [editingKey.value]: parsed }
  config.value = next
  showKeyModal.value = false
  await persist({ config: next })
}

const openFullEditor = () => {
  fullJsonText.value = JSON.stringify(config.value, null, 2)
  showFullModal.value = true
}

const submitFullJson = async () => {
  let parsed: unknown
  try {
    parsed = JSON.parse(fullJsonText.value || '{}')
  } catch {
    message.error('JSON 格式不正确')
    return
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    message.error('根节点须为 JSON 对象')
    return
  }
  config.value = parsed as Record<string, unknown>
  showFullModal.value = false
  await persist({ config: config.value })
}

const columns = [
  { title: 'Key（可自定义）', dataIndex: 'key', key: 'key', width: 240 },
  {
    title: '是否启用',
    key: 'rowEnabled',
    width: 120,
    customRender: ({ record }: { record: { key: string; enabled: boolean } }) => (
      <Switch
        checked={record.enabled}
        disabled={!enabled.value || saving.value}
        onChange={(v: boolean) => onRowEnabled(record.key, v)}
      />
    ),
  },
  {
    title: '配置值',
    key: 'preview',
    customRender: ({ record }: { record: { key: string; value: unknown } }) => (
      <span class="font-mono text-xs text-gray-600 break-all">
        {JSON.stringify(record.value)}
      </span>
    ),
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    customRender: ({ record }: { record: { key: string; value: unknown } }) => (
      <Button
        type="link"
        disabled={!enabled.value}
        onClick={() => openKeyEditor(record.key, record.value)}
      >
        编辑 JSON
      </Button>
    ),
  },
]

onMounted(fetchConfig)
</script>

<template>
  <div class="flex p-6 h-full bg-white rounded-xl shadow">
    <div class="flex-1 pl-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h2 class="text-xl font-bold text-white">功能开关</h2>
          <p class="mt-1 text-sm text-gray-500">
            仅一份 JSON：总开关关闭时客户端收到 false；开启时返回整份 JSON，子项
            key 自行扩展（后续主要在 jsdaily 里读取）。
          </p>
          <p v-if="updatedTime" class="mt-1 text-xs text-gray-400">
            更新于 {{ formatDate(updatedTime, 'time') }}
          </p>
        </div>
        <div class="flex gap-3 items-center">
          <span>总开关上线</span>
          <ASwitch
            :checked="enabled"
            :loading="saving"
            @change="onMasterEnabled"
          />
          <AButton :disabled="!enabled" @click="openFullEditor">
            编辑完整 JSON
          </AButton>
        </div>
      </div>

      <ATable
        :dataSource="featureRows"
        :loading="loading"
        rowKey="key"
        bordered
        :pagination="false"
        :columns="columns"
      />

      <AModal
        v-model:open="showKeyModal"
        :title="`编辑 ${editingKey}`"
        width="600px"
        ok-text="保存"
        :confirm-loading="saving"
        @ok="submitKeyJson"
      >
        <p class="mb-2 text-sm text-gray-500">
          设为 <code>false</code> 表示关闭该项；<code>true</code> 或对象表示开启并可带参数。
        </p>
        <ATextarea
          v-model:value="keyJsonText"
          :rows="14"
          class="font-mono text-sm"
        />
      </AModal>

      <AModal
        v-model:open="showFullModal"
        title="编辑完整 JSON"
        width="720px"
        ok-text="保存"
        :confirm-loading="saving"
        @ok="submitFullJson"
      >
        <ATextarea
          v-model:value="fullJsonText"
          :rows="20"
          class="font-mono text-sm"
        />
      </AModal>
    </div>
  </div>
</template>
