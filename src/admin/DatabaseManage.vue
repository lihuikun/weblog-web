<script setup lang="tsx">
import { ref } from 'vue'
import { message } from 'ant-design-vue'
import { runDatabaseBackup, type BackupResult } from '@/api/backup'

const loading = ref(false)
const backupResult = ref<BackupResult | null>(null)

const handleRunBackup = async () => {
    loading.value = true
    try {
        const { data } = await runDatabaseBackup()
        backupResult.value = data
        message.success('备份任务已触发')
    } catch (error) {
        console.error('数据库备份失败:', error)
        message.error('数据库备份失败')
    } finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="flex p-6 h-full bg-white rounded-xl shadow">
        <div class="flex-1 space-y-4">
            <h2 class="text-xl font-bold text-gray-800">数据库管理</h2>

            <div class="flex justify-between items-center p-4 bg-gray-50 rounded-md">
                <div>
                    <p class="font-medium text-gray-800">数据库备份</p>
                    <p class="mt-1 text-sm text-gray-500">触发后端备份接口，完成后可在后端查看备份文件。</p>
                </div>
                <AButton type="primary" :loading="loading" @click="handleRunBackup">
                    数据库备份
                </AButton>
            </div>
        </div>
    </div>
</template>

