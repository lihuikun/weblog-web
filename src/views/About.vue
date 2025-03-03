<script setup lang="ts">
// About.vue
</script>

<template>
  <div>
    <a-typography-title :level="2">关于</a-typography-title>
    
    <a-card class="mb-6">
      <a-typography-title :level="3">项目技术栈</a-typography-title>
      
      <a-typography>
        <a-typography-paragraph>
          本项目使用以下技术栈构建：
        </a-typography-paragraph>
        
        <a-typography-paragraph>
          <ul class="list-disc pl-5 space-y-2">
            <li><span class="font-medium">Vue 3:</span> 渐进式 JavaScript 框架</li>
            <li><span class="font-medium">TypeScript:</span> JavaScript 的超集，添加了类型系统</li>
            <li><span class="font-medium">Ant Design Vue:</span> 基于 Ant Design 设计体系的 Vue UI 组件库</li>
            <li><span class="font-medium">Tailwind CSS:</span> 实用优先的 CSS 框架</li>
            <li><span class="font-medium">Vite:</span> 下一代前端构建工具</li>
            <li><span class="font-medium">Axios:</span> 基于 Promise 的 HTTP 客户端</li>
            <li><span class="font-medium">Vue Router:</span> Vue.js 的官方路由</li>
          </ul>
        </a-typography-paragraph>
      </a-typography>
      
      <a-divider />
      
      <a-typography-title :level="3">项目特点</a-typography-title>
      
      <a-typography>
        <a-typography-paragraph>
          <ul class="list-disc pl-5 space-y-2">
            <li>使用 Vue 3 的 Composition API</li>
            <li>TypeScript 类型支持</li>
            <li>响应式设计，适配大小屏幕</li>
            <li>封装的 Axios 请求</li>
            <li>Hash 路由模式</li>
            <li>Ant Design Vue 组件库</li>
            <li>Tailwind CSS 实用工具类</li>
          </ul>
        </a-typography-paragraph>
      </a-typography>
      
      <a-divider />
      
      <a-typography-title :level="3">布局结构</a-typography-title>
      
      <a-typography>
        <a-typography-paragraph>
          本项目的布局结构参考了"稀土掘金"网站，包括：
        </a-typography-paragraph>
        
        <a-typography-paragraph>
          <ul class="list-disc pl-5 space-y-2">
            <li>响应式顶部导航栏</li>
            <li>大屏幕下的三栏布局（左侧菜单、内容区、右侧信息）</li>
            <li>小屏幕下的单栏布局（优化的移动端体验）</li>
            <li>文章列表展示</li>
            <li>用户信息和交互组件</li>
          </ul>
        </a-typography-paragraph>
      </a-typography>
    </a-card>
    
    <a-card>
      <a-result
        status="success"
        title="项目搭建成功！"
        sub-title="您现在可以开始开发您的应用了"
      >
        <template #extra>
          <a-button type="primary">
            <router-link to="/">返回首页</router-link>
          </a-button>
        </template>
      </a-result>
    </a-card>
  </div>
</template>