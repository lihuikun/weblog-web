<script setup lang="tsx">
import { ref, onMounted, watch, computed, nextTick, onUnmounted, watchEffect } from 'vue'
import { message, Spin, Card, Tabs, Switch, Tag } from 'ant-design-vue'
import { EyeOutlined, EyeInvisibleOutlined, CrownOutlined } from '@ant-design/icons-vue'
import { getInterviewList, getInterviewAnswer, Interview as InterviewType } from '@/api/interview'
import { difficultyOptions, difficultyMap } from '@/api/constants'
import { useUserStore } from '@/stores/userStore'
import { useRoute, useRouter } from 'vue-router'
import { MdPreview } from 'md-editor-v3'
import { useDateFormatter } from '@/hooks/useDateFormatter'
import 'md-editor-v3/lib/preview.css';
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

// 前端宝典列表
const interviews = ref<InterviewType[]>([])
const loading = ref(false)
const loadingMore = ref(false)
const error = ref<string | null>(null)
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const hasMore = ref(true)
const isInitialized = ref(false) // 添加初始化标志

// 日期格式化
const { formatDate } = useDateFormatter()

// 筛选条件
const currentDifficulty = ref<number | string>(0) // 0 表示全部
const requirePremium = ref<string>('') // 空字符串表示全部
const selectedCategory = ref<string | number>('all') // 默认为全部
const showAllAnswers = ref(false) // 控制是否显示所有答案

// 从路由参数中获取分类
const initFromRoute = () => {
    const categoryId = route.query.category || 'all'
    selectedCategory.value = categoryId as string
}

// 记录每个题目答案的显示状态
const answerVisibility = ref<Record<number, boolean>>({})

// 获取前端宝典列表
const fetchInterviews = async (isLoadMore = false) => {
    // 防止重复请求
    if ((isLoadMore && loadingMore.value) || (!isLoadMore && loading.value)) return

    if (isLoadMore) {
        loadingMore.value = true
    } else {
        loading.value = true
    }

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

        if (isLoadMore) {
            interviews.value = [...interviews.value, ...data.list]
        } else {
            interviews.value = data.list
        }

        total.value = data.total
        hasMore.value = interviews.value.length < total.value
    } catch (err) {
        console.error('获取前端宝典列表失败:', err)
        error.value = '获取前端宝典列表失败'
        message.error('获取前端宝典列表失败')
    } finally {
        loading.value = false
        loadingMore.value = false
    }
}

// 加载更多前端宝典
const loadMore = async () => {
    // 如果正在加载或没有更多数据，直接返回
    if (loadingMore.value || !hasMore.value) return
    
    page.value++
    await fetchInterviews(true)
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
            // 更新前端宝典对象，添加答案
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

const { sideMenuId } = defineProps<{ sideMenuId: string[] }>();
// 监听路由变化
watchEffect(() => {
    // 避免重复初始化
    if (isInitialized.value && sideMenuId[0] === selectedCategory.value) {
        return
    }
    
    console.log('初始化数据', sideMenuId)
    selectedCategory.value = sideMenuId[0]
    page.value = 1
    interviews.value = []
    answerVisibility.value = {}
    isInitialized.value = true
    fetchInterviews()
})

// 监听页面滚动，实现无限加载
const scrollContainer = ref<HTMLElement | null>(null)

const handleScroll = (e: Event) => {
    const element = e.target as HTMLElement
    const scrollBottom = element.scrollHeight - element.scrollTop - element.clientHeight
    
    // 当滚动到距离底部 100px 时加载更多
    if (scrollBottom < 100 && !loadingMore.value && hasMore.value) {
        loadMore()
    }
}

// 检查用户是否是会员
const checkUserIsPremium = () => {
    isPremium.value = userStore.userInfo?.isPremium || false
}

// 获取分类名称和颜色
const getCategoryName = (categoryId: number) => {
    const category = menuOptions.value.find(item => item.key === categoryId.toString())
    return category?.label || '未分类'
}

// 获取分类颜色
const getCategoryColor = (categoryId: number) => {
    // 根据分类ID返回不同的颜色
    const colorMap: Record<string, string> = {
        '1': 'green',    // 前端
        '2': 'blue',     // 后端
        '3': 'purple',   // 算法
        '4': 'orange',   // 数据库
        '5': 'cyan',     // 网络
        '6': 'magenta',  // 系统设计
        '7': 'red',      // 项目管理
        '8': 'volcano',  // DevOps
        '9': 'gold',     // 软技能
    }
    
    return colorMap[categoryId.toString()] || 'gold'
}

// 获取难度对应的文字和颜色
const getDifficultyInfo = (difficulty: number) => {
    const info = difficultyMap[difficulty as keyof typeof difficultyMap]
    return info || { color: 'default', text: '未知' }
}

onMounted(() => {
    initFromRoute()
    checkUserIsPremium()
})


</script>

<template>
    <div class="p-4 flex flex-col h-full">
        <!-- 顶部固定的筛选栏 -->
        <div class="pb-4 bg-white xs:pb-1">
            <div class="pb-2 bg-white">
                <!-- 难度选择Tab -->
                <div class="flex mb-4 xs:mb-1 overflow-x-auto scrollbar-hide">
                    <div v-for="option in [{ value: 0, label: '全部' }, ...difficultyOptions]" :key="option.value" :class="[
                        'px-6 py-1.5 cursor-pointer text-sm rounded mr-1 transition-colors whitespace-nowrap',
                        currentDifficulty == option.value
                            ? 'bg-blue-50 text-blue-500 font-medium'
                            : 'hover:bg-blue-50 hover:text-blue-500'
                    ]" @click="currentDifficulty = option.value">
                        {{ option.label }}
                    </div>
                </div>
            </div>

            <!-- 会员/非会员选择 + 显示答案开关 -->
            <div class="flex justify-between items-center bg-white">
                <div class="flex mb-4 xs:mb-1">
                    <div class="px-5 py-1.5 cursor-pointer text-sm rounded mr-1 transition-colors"
                        :class="{ 'bg-blue-50 text-blue-500 font-medium': requirePremium === '', 'hover:bg-blue-50 hover:text-blue-500': requirePremium !== '' }"
                        @click="requirePremium = ''">
                        全部
                    </div>
                    <div class="px-5 py-1.5 cursor-pointer text-sm rounded mr-1 transition-colors"
                        :class="{ 'bg-blue-50 text-blue-500 font-medium': requirePremium === 'false', 'hover:bg-blue-50 hover:text-blue-500': requirePremium !== 'false' }"
                        @click="requirePremium = 'false'">
                        免费
                    </div>
                    <div class="px-5 py-1.5 cursor-pointer text-sm rounded mr-1 transition-colors"
                        :class="{ 'bg-blue-50 text-blue-500 font-medium': requirePremium === 'true', 'hover:bg-blue-50 hover:text-blue-500': requirePremium !== 'true' }"
                        @click="requirePremium = 'true'">
                        VIP
                    </div>
                </div>

                <div class="flex gap-2 items-center">
                    <span class="xs:hidden md:block">显示所有答案</span>
                    <Switch v-model:checked="showAllAnswers" @change="toggleAllAnswers" />
                    <div class="text-sm text-gray-500 xs:hidden md:block">
                        总题数: {{ total }}
                    </div>
                </div>
            </div>
        </div>

        <!--内容区域，可滚动但隐藏滚动条 -->
        <div class="flex-1 overflow-y-auto scrollbar-hide" ref="scrollContainer" @scroll="handleScroll">
            <div class="flex flex-wrap gap-6 mt-4 md:flex-nowrap">
                <!-- 题目列表 -->
                <div class="flex-1">
                    <!-- 前端宝典列表 -->
                    <Spin :spinning="loading && !loadingMore">
                        <div v-if="error" class="p-4 text-red-500">{{ error }}</div>

                        <div v-else-if="interviews.length === 0 && !loading"
                            class="p-6 text-center text-gray-500 bg-gray-50 rounded-lg">
                            没有找到相关前端宝典
                        </div>

                        <div v-else class="space-y-4">
                            <Card v-for="interview in interviews" :key="interview.id"
                                class="w-full border transition-all duration-300 hover:shadow-md relative"
                                :bordered="true">
                                <!-- VIP角标 -->
                                <div v-if="interview.requirePremium" class="absolute top-0 right-0 rounded-lg">
                                    <div class="vip-corner">
                                        <span class="vip-text">
                                            VIP
                                        </span>
                                    </div>
                                </div>

                                <!-- 题目标题和难度 -->
                                <div class="flex justify-between items-center mb-4">
                                    <h3 class="text-lg font-bold">{{ interview.question }}</h3>
                                    <div class="flex gap-2 items-center mr-2">
                                        <Tag :color="getDifficultyInfo(interview.difficulty).color">
                                            {{ getDifficultyInfo(interview.difficulty).text }}
                                        </Tag>
                                    </div>
                                </div>

                                <!-- 答案和切换按钮 -->
                                <div class="pt-3 border-t">
                                    <div class="flex justify-between items-center">
                                        <div class="text-sm text-gray-500 flex items-center gap-3">
                                            分类：<Tag :color="getCategoryColor(interview.categoryId)">{{
                                                getCategoryName(interview.categoryId) }}</Tag>
                                            <span class="text-gray-400">{{ formatDate(interview.createTime, 'date')
                                                }}</span>
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
                                        <div v-if="interview.answer" class="p-4 bg-gray-50 rounded-md">
                                            <div class="mb-3 text-blue-600 flex items-center">
                                                <div class="w-1 h-5 bg-blue-500 rounded-full mr-2"></div>
                                                回答
                                            </div>
                                            <MdPreview class="bg-gray-50" :modelValue="interview.answer" />
                                        </div>
                                        <div v-else class="p-4 text-gray-500 bg-gray-50 rounded-md">
                                            {{ interview.requirePremium && !isPremium ? '此答案需要会员权限才能查看' : '加载中...' }}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <!-- 加载更多/无更多数据 -->
                        <div v-if="loadingMore" class="flex justify-center py-4">
                            <a-spin />
                        </div>
                        <div v-else-if="!hasMore && interviews.length > 0" class="py-6 text-center text-gray-400">
                            已经到底啦 ~
                        </div>
                        <div v-else-if="interviews.length > 0 && hasMore" class="my-6 text-center">
                            <div class="py-3 text-blue-500 transition-colors cursor-pointer hover:text-blue-700"
                                @click="loadMore" :class="{ 'opacity-50 cursor-not-allowed': loadingMore }">
                                加载更多
                            </div>
                        </div>
                    </Spin>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
/* 隐藏滚动条但保持可滚动功能 */
.scrollbar-hide {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */

    &::-webkit-scrollbar {
        display: none;
        /* Chrome, Safari, Opera */
    }
}

/* 保留背景色变量 */
.bg-gray-50 {
    background-color: var(--color-gray-50);

    h2 {
        font-size: 20px;
    }
}

/* VIP角标样式 */
.vip-corner {
    position: absolute;
    top: 0;
    right: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 40px 40px 0;
    border-color: transparent #ff9800 transparent transparent;
}

.vip-text {
    position: absolute;
    top: 3px;
    right: -35px;
    transform: rotate(45deg);
    color: white;
    font-size: 12px;
    font-weight: bold;
}
</style>