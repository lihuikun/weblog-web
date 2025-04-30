<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
// 拿到当前路由的meta.url
const route = useRoute()
const router = useRouter()
const { sideMenuId } = defineProps<{ sideMenuId: string }>();
const currentGameUrl = computed(() => {
  console.log('route.params.key', route, sideMenuId)
  const menu = (route.meta.menu as { key: string; url: string }[])
  return menu.find((item: { key: string }) => item.key === sideMenuId[0])?.url
})
console.log("🚀 ~ currentGame ~ currentGame:", currentGameUrl.value, sideMenuId)

</script>

<template>
  <div class="w-full h-full">
    <iframe :src="currentGameUrl" frameborder="0" width="100%" height="100%"></iframe>
  </div>
</template>