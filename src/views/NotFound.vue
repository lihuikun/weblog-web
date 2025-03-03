<script setup lang="ts">
// NotFound.vue
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12">
    <a-result
      status="404"
      title="404"
      sub-title="抱歉，您访问的页面不存在"
    >
      <template #extra>
        <a-button type="primary">
          <router-link to="/">返回首页</router-link>
        </a-button>
      </template>
    </a-result>
  </div>
</template>