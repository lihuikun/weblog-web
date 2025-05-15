<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { message, Spin, Button } from 'ant-design-vue';
import { SoundOutlined, ReloadOutlined, ShareAltOutlined } from '@ant-design/icons-vue';
import { getDailyQuote, DailyQuote } from '@/api/dailyQuote';

// 每日一句数据
const quote = ref<DailyQuote | null>(null);
const loading = ref(true);

// 音频播放
const audio = ref<HTMLAudioElement | null>(null);
const isPlaying = ref(false);

// 获取每日一句
const fetchDailyQuote = async () => {
    loading.value = true;
    const res = await getDailyQuote();
    quote.value = res.data;
    loading.value = false;

};

// 播放TTS
const playTts = () => {
    if (!quote.value?.tts) {
        message.warning('当前没有可用的语音');
        return;
    }

    if (!audio.value) {
        audio.value = new Audio(quote.value.tts);

        // 监听播放结束
        audio.value.addEventListener('ended', () => {
            isPlaying.value = false;
        });
    } else {
        // 更新音频源
        audio.value.src = quote.value.tts;
    }

    // 播放或暂停
    if (isPlaying.value) {
        audio.value.pause();
        isPlaying.value = false;
    } else {
        audio.value.play().catch(err => {
            console.error('播放失败', err);
            message.error('语音播放失败');
        });
        isPlaying.value = true;
    }
};

// 刷新
const handleRefresh = () => {
    // 先停止播放
    if (audio.value && isPlaying.value) {
        audio.value.pause();
        isPlaying.value = false;
    }

    fetchDailyQuote();
};

// 分享
const handleShare = async () => {
    if (!quote.value) return;
    const text = `${quote.value.content} —— ${quote.value.author || '前端的日常'}`;
    navigator.clipboard.writeText(text).then(() => {
        message.success('已复制到剪贴板');
    }).catch(() => {
        message.error('复制失败');
    });

};

// 组件挂载时获取数据
onMounted(() => {
    fetchDailyQuote();
});
</script>

<template>
    <div class="bg-white daily-quote-container">
        <div class="quote-header">
            <h1>每日一句</h1>
            <div class="quote-actions">
                <Button type="text" shape="circle" @click="playTts" :disabled="!quote?.tts" class="action-button">
                    <SoundOutlined :class="{ 'text-primary': isPlaying }" />
                </Button>
                <Button type="text" shape="circle" @click="handleRefresh" class="action-button">
                    <ReloadOutlined />
                </Button>
                <Button type="text" shape="circle" @click="handleShare" class="action-button">
                    <ShareAltOutlined />
                </Button>
            </div>
        </div>

        <Spin :spinning="loading">
            <div v-if="quote" class="quote-content">
                <div class="quote-image-container">
                    <img :src="quote.img" alt="每日一句配图" class="quote-image" />
                </div>

                <div class="quote-text-container">
                    <blockquote class="quote-text">
                        <span class="quote-text-css">“</span>
                        {{ quote.content }}
                        <span class="quote-text-css">”</span>
                    </blockquote>
                    <div class="quote-text">
                        {{ quote.note }}
                    </div>

                    <div class="quote-author">—— {{ quote.author || '前端的日常' }}</div>

                    <div v-if="quote.translation" class="quote-translation">
                        {{ quote.translation }}
                    </div>

                    <div class="quote-date">{{ quote.date }}</div>
                </div>
            </div>

            <div v-else-if="!loading" class="quote-empty">
                <p>暂无每日一句</p>
                <Button type="primary" @click="handleRefresh">刷新</Button>
            </div>
        </Spin>
    </div>
</template>

<style scoped>
.daily-quote-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 24px;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05);
}

.quote-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 16px;
}

.quote-header h1 {
    font-size: 24px;
    margin: 0;
    font-weight: 600;
    background: linear-gradient(45deg, #1890ff, #52c41a);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
}

.quote-actions {
    display: flex;
    gap: 8px;
}

.action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
}

.quote-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;
    justify-content: center;
}

.quote-image-container {
    width: 50%;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quote-image {
    width: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.quote-image:hover {
    transform: scale(1.02);
}

.quote-text-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border-radius: 12px;
    position: relative;
}

.quote-text {
    font-size: 20px;
    line-height: 1.6;
    color: #333;
    margin: 0;
    font-weight: 500;
    font-style: italic;
    position: relative;
    padding-left: 24px;
}

.quote-text-css {
    font-size: 36px;
    color: #1890ff;
    line-height: 1;
}


.quote-author {
    text-align: right;
    font-size: 16px;
    color: #666;
}

.quote-translation {
    font-size: 14px;
    color: #888;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px dashed #ddd;
}

.quote-date {
    text-align: right;
    font-size: 14px;
    color: #999;
}

.quote-empty {
    text-align: center;
    padding: 60px 0;
    color: #999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}

/* 响应式布局 */
@media (max-width: 768px) {
    .daily-quote-container {
        padding: 16px;
        border-radius: 0;
        box-shadow: none;
    }

    .quote-text {
        font-size: 16px;
    }
}

.text-primary {
    color: #1890ff;
}
</style>