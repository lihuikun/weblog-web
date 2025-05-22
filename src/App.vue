<script setup lang="ts">
import { useRoute } from 'vue-router';
import AppLayout from '@/layouts/AppLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

const route = useRoute();
</script>

<template>
  <AppLayout v-if="route.meta.layout === 'default'">
    <template v-slot="{ sideMenuId }">
      <router-view :sideMenuId="sideMenuId" />
    </template>
  </AppLayout>
  <AdminLayout v-else-if="route.meta.layout === 'admin'">
    <router-view />
  </AdminLayout>
  <router-view v-else />
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>