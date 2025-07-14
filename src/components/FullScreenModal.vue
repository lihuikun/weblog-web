<script setup lang="tsx">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{
  open: boolean
  title: string
}>()

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'ok'): void
}>()

const handleOk = () => {
  emit('ok')
}

const handleCancel = () => {
  emit('update:open', false)
}
</script>

<template>
  <AModal
    :open="open"
    :title="title"
    wrap-class-name="full-screen-modal"
    @update:open="(val: boolean) => emit('update:open', val)"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <slot></slot>
  </AModal>
</template>

<style lang="scss">
.ant-modal {
  width: 100vw !important;
  max-width: 100vw !important;
  top: 0;
  padding-bottom: 0;
  border-radius: 0;
}

.ant-modal .ant-modal-content {
  border-radius: 0 !important;
}
.ant-modal-body {
  height: calc(100vh - 116px);
  overflow-y: auto;
}
</style> 