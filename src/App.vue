<script setup lang="ts">
import { useRoute } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';

const route = useRoute();
</script>

<template>
  <AppLayout v-if="route.meta.layout === 'default'">
    <template v-slot="{ sideMenuId }">
      <router-view :sideMenuId="sideMenuId" />
    </template>
  </AppLayout>
  <router-view v-else />
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>