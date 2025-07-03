<script setup lang="tsx">
import { ref, onMounted, watch, computed } from 'vue'
import { message, Spin, Card, Tabs, Switch, Tag } from 'ant-design-vue'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons-vue'
import { getInterviewList, getInterviewAnswer, Interview as InterviewType } from '@/api/interview'
import { difficultyOptions, difficultyMap } from '@/api/constants'
import { useUserStore } from '@/stores/userStore'
import { useRoute, useRouter } from 'vue-router'

// 路由相关
const route = useRoute()
const router = useRouter()

// 获取路由中的技术分类菜单
const menuOptions = computed(() => {
  const routeMenu = route.meta?.menu as { key: string; label: string }[] || []
  return routeMenu
})

// 用户信息
const userStore = useUserStore()
const isPremium = ref(false) // 是否是会员用户

// 面试题列表
const interviews = ref<InterviewType[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const page = ref(1)
const pageSize = ref(20)
const total = ref(0)

// 筛选条件
const currentDifficulty = ref<number | string>(0) // 0 表示全部
const requirePremium = ref<string>('') // 空字符串表示全部
const selectedCategory = ref<string | number>('all') // 默认为全部
const showAllAnswers = ref(false) // 控制是否显示所有答案

// 记录每个题目答案的显示状态
const answerVisibility = ref<Record<number, boolean>>({})

// 获取面试题列表
const fetchInterviews = async () => {
  loading.value = true
  error.value = null
  
  try {
    // 构建请求参数
    const params: any = { 
      page: page.value, 
      pageSize: pageSize.value 
    }
    
    // 添加筛选条件
    if (currentDifficulty.value !== 0) {
      params.difficulty = currentDifficulty.value
    }
    
    if (requirePremium.value !== '') {
      params.requirePremium = requirePremium.value === 'true'
    }
    
    if (selectedCategory.value !== 'all') {
      params.categoryId = selectedCategory.value
    }
    
    const { data } = await getInterviewList(params)
    interviews.value = data.list
    total.value = data.total
  } catch (err) {
    console.error('获取面试题列表失败:', err)
    error.value = '获取面试题列表失败'
    message.error('获取面试题列表失败')
  } finally {
    loading.value = false
  }
}

// 加载更多面试题
const loadMore = async () => {
  if (loading.value) return
  if (interviews.value.length >= total.value) return
  
  page.value++
  loading.value = true
  
  try {
    const params: any = { 
      page: page.value, 
      pageSize: pageSize.value 
    }
    
    if (currentDifficulty.value !== 0) {
      params.difficulty = currentDifficulty.value
    }
    
    if (requirePremium.value !== '') {
      params.requirePremium = requirePremium.value === 'true'
    }
    
    if (selectedCategory.value !== 'all') {
      params.categoryId = selectedCategory.value
    }
    
    const { data } = await getInterviewList(params)
    interviews.value = [...interviews.value, ...data.list]
  } catch (err) {
    console.error('加载更多面试题失败:', err)
    message.error('加载更多面试题失败')
  } finally {
    loading.value = false
  }
}

// 获取答案
const getAnswer = async (id: number) => {
  if (!userStore.token) {
    message.warning('请先登录')
    return
  }
  
  try {
    const { data } = await getInterviewAnswer(id)
    return data.answer
  } catch (err: any) {
    // 处理会员权限错误
    if (err.response && err.response.status === 403) {
      message.warning('此答案需要会员权限才能查看')
    } else {
      message.error('获取答案失败')
    }
    return null
  }
}

// 切换单个问题答案显示状态
const toggleAnswer = async (interview: InterviewType) => {
  // 如果答案已经存在或者已经在显示中，直接切换显示状态
  if (interview.answer || answerVisibility.value[interview.id]) {
    answerVisibility.value[interview.id] = !answerVisibility.value[interview.id]
    return
  }
  
  // 如果还没有加载答案，则获取答案
  try {
    const answer = await getAnswer(interview.id)
    
    if (answer) {
      // 更新面试题对象，添加答案
      const index = interviews.value.findIndex(item => item.id === interview.id)
      if (index !== -1) {
        interviews.value[index] = {
          ...interviews.value[index],
          answer
        }
        // 显示答案
        answerVisibility.value[interview.id] = true
      }
    }
  } catch (err) {
    console.error('获取答案失败:', err)
  }
}

// 切换所有答案显示状态
const toggleAllAnswers = () => {
  // 如果开启全部显示，可能需要逐个加载答案
  if (showAllAnswers.value) {
    interviews.value.forEach(interview => {
      answerVisibility.value[interview.id] = true
      // 如果没有答案，需要加载
      if (!interview.answer) {
        getAnswer(interview.id).then(answer => {
          if (answer) {
            const index = interviews.value.findIndex(item => item.id === interview.id)
            if (index !== -1) {
              interviews.value[index] = {
                ...interviews.value[index],
                answer
              }
            }
          }
        })
      }
    })
  } else {
    // 关闭所有答案显示
    interviews.value.forEach(interview => {
      answerVisibility.value[interview.id] = false
    })
  }
}

// 监听筛选条件变化
watch([currentDifficulty, requirePremium], () => {
  page.value = 1 // 重置页码
  interviews.value = [] // 清空当前列表
  answerVisibility.value = {} // 重置答案显示状态
  fetchInterviews() // 重新加载数据
})

// 监听页面滚动，实现无限加载
const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
  const clientHeight = document.documentElement.clientHeight || document.body.clientHeight
  
  // 滚动到底部时加载更多
  if (scrollTop + clientHeight >= scrollHeight - 100 && !loading.value) {
    loadMore()
  }
}

// 检查用户是否是会员
const checkUserIsPremium = () => {
  isPremium.value = userStore.userInfo?.isPremium || false
}

// 获取分类名称
const getCategoryName = (categoryId: number) => {
  const category = menuOptions.value.find(item => item.key === categoryId.toString())
  return category?.label || '未分类'
}

// 获取难度对应的文字和颜色
const getDifficultyInfo = (difficulty: number) => {
  const info = difficultyMap[difficulty as keyof typeof difficultyMap]
  return info || { color: 'default', text: '未知' }
}

onMounted(() => {
  fetchInterviews()
  checkUserIsPremium()
  window.addEventListener('scroll', handleScroll)
})

// 组件卸载时移除滚动监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 格式化难度选项，添加"全部"选项
const formattedDifficultyOptions = [
  { value: 0, label: '全部难度' },
  ...difficultyOptions
]
</script>

<template>
    <div class="p-4 interview-page">
        <!-- 固定吸顶的筛选栏 -->
        <div class="sticky top-0 z-10 pb-4 bg-white">
            <div class="pb-2 bg-white tab-container">
                <!-- 顶部难度选择Tab -->
                <div class="custom-tabs difficulty-tabs">
                    <div v-for="option in [{ value: 0, label: '全部' }, ...difficultyOptions]" :key="option.value" :class="[
              'tab-item', 
              currentDifficulty == option.value ? 'active' : ''
            ]" @click="currentDifficulty = option.value">
                        {{ option.label }}
                    </div>
                </div>
            </div>

            <!-- 会员/非会员选择 + 显示答案开关 -->
            <div class="flex justify-between items-center bg-white">
                <div class="custom-tabs premium-tabs">
                    <div class="tab-item" :class="{ active: requirePremium === '' }" @click="requirePremium = ''">
                        全部
                    </div>
                    <div class="tab-item" :class="{ active: requirePremium === 'false' }"
                        @click="requirePremium = 'false'">
                        免费
                    </div>
                    <div class="tab-item" :class="{ active: requirePremium === 'true' }"
                        @click="requirePremium = 'true'">
                        会员
                    </div>
                </div>

                <div class="flex gap-2 items-center">
                    <span>显示所有答案</span>
                    <Switch v-model:checked="showAllAnswers" @change="toggleAllAnswers" />
                </div>
            </div>
        </div>

        <!--内容 -->
        <div class="flex flex-wrap gap-6 mt-4 md:flex-nowrap">


            <!-- 题目列表 -->
            <div class="flex-1">
                <h2 class="mb-4 text-xl font-bold">面试题库</h2>

                <!-- 面试题列表 -->
                <Spin :spinning="loading">
                    <div v-if="error" class="p-4 text-red-500">{{ error }}</div>

                    <div v-else-if="interviews.length === 0 && !loading"
                        class="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
                        没有找到相关面试题
                    </div>

                    <div v-else class="space-y-4">
                        <Card v-for="interview in interviews" :key="interview.id" class="w-full interview-card"
                            :bordered="true">
                            <!-- 题目标题和难度 -->
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-bold">{{ interview.title }}</h3>
                                <div class="flex gap-2 items-center">
                                    <Tag :color="getDifficultyInfo(interview.difficulty).color">
                                        {{ getDifficultyInfo(interview.difficulty).text }}
                                    </Tag>
                                    <Tag v-if="interview.requirePremium" color="gold">会员</Tag>
                                </div>
                            </div>

                            <!-- 题目内容 - 完整显示 -->
                            <div class="mb-4 text-gray-700 whitespace-pre-wrap">{{ interview.question }}</div>

                            <!-- 答案和切换按钮 -->
                            <div class="pt-3 border-t">
                                <div class="flex justify-between items-center">
                                    <div class="text-sm text-gray-500">
                                        分类：{{ getCategoryName(interview.categoryId) }}
                                    </div>

                                    <div class="flex gap-1 items-center text-blue-500 transition-colors cursor-pointer hover:text-blue-700"
                                        @click="toggleAnswer(interview)">
                                        <EyeOutlined v-if="!answerVisibility[interview.id]" />
                                        <EyeInvisibleOutlined v-else />
                                        <span>{{ answerVisibility[interview.id] ? '隐藏答案' : '查看答案' }}</span>
                                    </div>
                                </div>

                                <!-- 答案内容 -->
                                <div v-if="answerVisibility[interview.id]" class="pt-4 mt-4 border-t">
                                    <div v-if="interview.answer" class="p-4 whitespace-pre-wrap bg-gray-50 rounded-md">
                                        <div class="mb-2 font-bold">答案：</div>
                                        {{ interview.answer }}
                                    </div>
                                    <div v-else class="p-4 text-gray-500 bg-gray-50 rounded-md">
                                        {{ interview.requirePremium && !isPremium ? '此答案需要会员权限才能查看' : '加载中...' }}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <!-- 加载更多 -->
                    <div v-if="interviews.length < total" class="my-6 text-center">
                        <div class="py-3 text-blue-500 transition-colors cursor-pointer hover:text-blue-700"
                            @click="loadMore" :class="{ 'opacity-50 cursor-not-allowed': loading }">
                            {{ loading ? '加载中...' : '加载更多' }}
                        </div>
                    </div>
                </Spin>
            </div>
        </div>
    </div>
</template>

<style scoped>
.interview-card {
  transition: all 0.3s ease;
}

.interview-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 吸顶效果 */
.sticky {
  position: sticky;
  background-color: white;
  border-bottom: none;
}

/* 自定义Tab样式 */
.custom-tabs {
  display: flex;
  border-bottom: none;
  margin-bottom: 1rem;
}

.tab-item {
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  position: relative;
  font-size: 14px;
  transition: all 0.2s;
  border-radius: 4px;
  margin-right: 0.25rem;
}

.tab-item:hover {
  color: #1890ff;
  background-color: rgba(24, 144, 255, 0.05);
}

.tab-item.active {
  color: #1890ff;
  font-weight: 500;
  background-color: rgba(24, 144, 255, 0.1);
}

.tab-item.active::after {
  display: none;
}

.difficulty-tabs .tab-item {
  padding: 0.75rem 1.5rem;
}

.premium-tabs .tab-item {
  padding: 0.5rem 1.2rem;
}
</style> 