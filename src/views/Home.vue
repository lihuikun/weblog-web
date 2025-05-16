<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getArticles } from '@/api/articles';
import Like from '@/assets/icons/like.svg';
import View from '@/assets/icons/view.svg';
import Editor from '@/views/Editor.vue';
import { vMarkdown } from '@/directives/markdown'
import { useUploadImage } from "@/hooks/useUploadImage";

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

// 解构所需的方法和状态
const { uploadImg, loading: uploading } = useUploadImage();

// 记录上传后的URL
const uploadedUrl = ref('');

const loading = ref(true);
const error = ref<string | null>(null);
const tableData = ref<Post[]>([])
const params = ref({
  page: 1,
  pageSize: 10,
  categoryId: 1
})
const getList = async (categoryId: number | string) => {
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
const { sideMenuId } = defineProps<{ sideMenuId: string[] }>();
const visible = ref(false)
const article = ref({
  title: '',
  content: '',
  categoryId: '',
  coverImage: '',
  id: ''
})
const isPreview = ref(false)
const handleEdit = (item: any) => {
  visible.value = true
  article.value = item
  isPreview.value = false
  console.log("🚀 ~ handleEdit ~ article.value:", article.value)
}
const handlePreview = (item: any) => {
  visible.value = true
  // 绕开掘金防盗链
  item.content = item.content.replace(/<img\s+[^>]*src="(https?:\/\/[^"]+)"[^>]*>/g,
    (m: string, url: string | number | boolean) => m.replace(url as string, `/proxy/img?url=${encodeURIComponent(url as string)}`)
  )
  article.value = item
  isPreview.value = true
  console.log("🚀 ~ handlePreview ~ article.value:", article.value)
}

// 自定义上传方法
const customRequest = async (options: any) => {
  const { file, onSuccess, onError, onProgress } = options;
  console.log('自定义请求收到文件对象:', file);
  console.log('文件对象类型:', Object.prototype.toString.call(file));

  try {
    if (!file) {
      throw new Error('文件不存在');
    }

    // 显示上传进度
    onProgress && onProgress({ percent: 50 });

    // 获取有效的File对象
    let fileObj: File;
    if (file instanceof File) {
      fileObj = file;
    } else if (file && typeof file === 'object' && 'originFileObj' in file) {
      fileObj = (file as any).originFileObj;
      if (!(fileObj instanceof File)) {
        throw new Error('无法获取有效的File对象');
      }
    } else {
      throw new Error('无效的文件对象');
    }

    console.log('开始上传文件:', fileObj.name, fileObj.size, fileObj.type);

    // 调用我们的上传方法
    const url = await uploadImg(fileObj);
    console.log("上传返回的URL:", url);

    if (url) {
      uploadedUrl.value = url;
      onProgress && onProgress({ percent: 100 });
      onSuccess && onSuccess({ url }, new XMLHttpRequest());
    } else {
      throw new Error('上传失败，未返回URL');
    }
  } catch (error) {
    console.error('上传出错:', error);
    onError && onError(error as any);
  }
};

// 处理上传变化事件
async function handleUploadChange(info: any) {
  console.log("上传状态变化:", info);

  if (info.file.status === 'uploading') {
    console.log('正在上传...');
  } else if (info.file.status === 'done') {
    console.log('上传完成:', info.file);
    if (info.file.response && info.file.response.url) {
      uploadedUrl.value = info.file.response.url;
    }
  } else if (info.file.status === 'error') {
    console.error('上传失败:', info.file);
  }
}

watchEffect(() => {
  if (sideMenuId) {
    getList(sideMenuId[0])
  }
})
onMounted(() => {
  getList(0);
});

const directives = {
  markdown: vMarkdown
}
</script>

<template>
  <div>
    <div class="mb-6">
      <!-- <h2 class="mb-2 text-lg">测试上传图片</h2>
      <a-upload :custom-request="customRequest" :show-upload-list="true" :multiple="false" accept="image/*"
        @change="handleUploadChange" list-type="picture" name="files">
        <a-button :loading="uploading" type="primary">
          上传图片
        </a-button>
      </a-upload> -->

      <!-- 显示上传的图片 -->
      <div v-if="uploadedUrl" class="mt-4">
        <p>u4e0au4f20u6210u529f!</p>
        <img :src="uploadedUrl" alt="u4e0au4f20u7684u56feu7247" class="mt-2 w-64 rounded shadow" />
        <p class="mt-2 text-sm text-gray-500">URL: {{ uploadedUrl }}</p>
      </div>
    </div>

    <!-- 文章列表 -->
    <a-spin :spinning="loading">
      <div v-if="error" class="my-4">
        <a-alert :message="error" type="error" show-icon />
      </div>
      <div v-else>
        <a-list :data-source="tableData" item-layout="vertical" size="large">
          <template #renderItem="{ item }">
            <a-list-item :key="item.id" @click="handlePreview(item)">
              <a-list-item-meta>
                <template #title>
                  <a class="text-xl font-bold hover:text-blue-500">{{ item.title }}</a>
                </template>
                <template #description>
                  <div class="flex items-center text-sm text-gray-500 line-clamp-2">
                    <span class="mx-1" v-markdown>{{ item.content }}</span>
                  </div>
                </template>
              </a-list-item-meta>

              <div class="my-2 text-gray-600 line-clamp-2">{{ item.body }}</div>

              <div class="flex justify-between items-center mt-2">
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
                <img width="272" alt="cover" :src="item.coverImage" class="object-cover h-32 rounded-lg" />
              </template>
              <!-- <div>
                <AButton type="primary" @click.stop="handleEdit(item)">编辑文章</AButton>
              </div> -->
            </a-list-item>
          </template>
        </a-list>
      </div>
    </a-spin>
    <Editor v-model:visible="visible" v-model:article="article" v-model:isPreview="isPreview" />
  </div>
</template>

<style scoped>
/* 文本截断 */
.line-clamp-2 {
  /* 超出两行显示省略号 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>