import type { App } from 'vue'
import { setupPermissionDirective } from './permission'
import { setupNoCopyDirective } from './noCopy'

export function setupDirectives(app: App) {
    // 注册所有自定义指令
    setupPermissionDirective(app)
    setupNoCopyDirective(app)
} 