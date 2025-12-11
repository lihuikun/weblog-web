import request from '@/utils/request'

export interface BackupResult {
    message?: string
    fileName?: string
    url?: string
}

export function runDatabaseBackup() {
    return request({
        url: '/backups/run',
        method: 'post'
    })
}

