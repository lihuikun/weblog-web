<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getArticles } from '@/api/articles';
import Like from '@/assets/icons/like.svg';
import View from '@/assets/icons/view.svg';
interface Post {
  id: number;
  title: string;
  body: string;
  author: string;
  avatar: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
}
const loading = ref(true);
const error = ref<string | null>(null);
const tableData = ref<Post[]>([])
const params = ref({
  page: 1,
  pageSize: 10,
  categoryId: 1
})
const getList = async (categoryId: string | number) => {
  try {
    loading.value = true;
    const { data } = await getArticles({ ...params.value, categoryId });
    if (data) {
      tableData.value = data.rows;
    } else {
      error.value = '数据未定义';
    }
    console.log("🚀 ~ getList ~ data:", data)
  } catch (err) {
    error.value = '获取数据失败';
    console.error(err);
  } finally {
    loading.value = false;
  }
};
const { sideMenuId } = defineProps<{ sideMenuId: string }>();
watchEffect(() => {
  if (sideMenuId) {
    getList(sideMenuId[0])
  }
})
onMounted(() => {
  getList(0);
});
</script>

<template>
  <div>
    <!-- 内容标签页 -->
    <!-- <a-tabs v-model:activeKey="activeTab" class="mb-4">
      <a-tab-pane v-for="item in tabItems" :key="item.key" :tab="item.label" />
    </a-tabs> -->

    <!-- 文章列表 -->
    <a-spin :spinning="loading">
      <div v-if="error" class="my-4">
        <a-alert :message="error" type="error" show-icon />
      </div>

      <div v-else>
        <a-list :data-source="tableData" item-layout="vertical" size="large">
          <template #renderItem="{ item }">
            <a-list-item :key="item.id">
              <a-list-item-meta>
                <template #title>
                  <a class="text-xl font-bold hover:text-blue-500">{{ item.title }}</a>
                </template>
                <template #description>
                  <div class="flex items-center text-sm text-gray-500">
                    <span class="mx-1">{{ item.content }}</span>
                  </div>
                </template>
              </a-list-item-meta>

              <div class="text-gray-600 my-2 line-clamp-2">{{ item.body }}</div>

              <div class="flex items-center justify-between mt-2">
                <div class="flex space-x-2">
                  <a-tag v-for="tag in item.tags" :key="tag" color="blue">{{ tag }}</a-tag>
                </div>

                <div class="flex items-center space-x-4 text-gray-500">
                  <div class="flex gap-1">
                    <Like :style="{ color: '#cdcdcd', fontSize: '20px' }" />
                    {{ item.likeCount }}
                  </div>
                  <div class="flex gap-1">
                    <View :style="{ color: '#cdcdcd', fontSize: '20px' }" />
                    {{ item.viewCount }}
                  </div>
                </div>
              </div>
              <template #extra v-if="item.coverImage">
                <img width="272" alt="cover" :src="item.coverImage" class="rounded-lg object-cover h-32" />
              </template>
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-spin>
  </div>
</template>

<style scoped>
/* 文本截断 */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>