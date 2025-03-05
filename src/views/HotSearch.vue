<!--
 * @Description: 热搜组件
 * @Author: lihk
 * @Date: 2025-03-03 17:33:16
-->
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getHotSearch } from '@/api/hot-search'
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
const { sideMenuId } = defineProps<{ sideMenuId: string }>();

const tableList = ref<Post[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const getList = async (params) => {

  loading.value = true;
  const { data } = await getHotSearch(params);
  tableList.value = data;
  console.log("🚀 ~ getList ~ data:", data)
  loading.value = false;
};

function formatHotValue(value) {
  const units = [
    { threshold: 10000, unit: "万", divisor: 10000 },
    { threshold: 1000, unit: "千", divisor: 1000 }
  ];

  const unit = units.find(u => value >= u.threshold);
  return unit ? (value / unit.divisor).toFixed(1) + unit.unit : value;
}
function getRankColor(index) {
  switch (index) {
    case 0:
      return "text-red-500"; // 第一名红色
    case 1:
      return "text-yellow-500"; // 第二名黄色
    case 2:
      return "text-orange-500"; // 第三名橙色
    default:
      return ""; // 其他项默认颜色
  }
}
watchEffect(() => {
  if (sideMenuId) {
    getList({ source: sideMenuId[0] })
  }
})
</script>

<template>
  <div>

    <!-- 文章列表 -->
    <a-spin :spinning="loading">
      <div v-if="error" class="my-4">
        <a-alert :message="error" type="error" show-icon />
      </div>

      <div v-else>
        <a-list :data-source="tableList" item-layout="vertical" size="large">
          <template #renderItem="{ item, index }">
            <a-list-item :key="item.id">
              <div class="flex items-center justify-between">
                <div class="text-xl font-bold flex">
                  <div class="mr-2 text-gray-500 w-[25px]" :class="getRankColor(index)">{{ index + 1 }}</div>
                  <a class="hover:text-blue-500">{{ item.word }}</a>
                </div>
                <span class=" text-gray-500 min-w-[80px] ml-[20px]">
                  热度: {{ formatHotValue(item.hot_value) }}
                </span>
              </div>
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