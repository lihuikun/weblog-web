<!-- 友情链接 -->
<template>
    <div class="flex">
        <div class="flex-1">
            <ATypographyTitle :level="3" class="mt-4">友情链接</ATypographyTitle>
            <ACard class="mt-4" v-for="item in linkList" :key="item.name">
                <div class="flex items-center gap-2" @click="handleClick(item.url)">
                    <img :src="item.logo" alt="logo" class="w-10 h-10">
                    <div class="flex flex-col">
                        <div class="text-lg font-bold">{{ item.name }}</div>
                        <div class="text-sm text-gray-500">{{ item.desc }}</div>
                    </div>
                </div>
            </ACard>
        </div>
        <ATypographyTitle :level="5" class="mt-4 text-center">
            如需添加友情链接,请添加客服微信
            <img src="@/assets/imgs/wx.jpg" alt="客服微信" class="w-[300px]">
        </ATypographyTitle>
    </div>
</template>

<script setup lang="ts">
interface Link {
    name: string;
    logo: string;
    url: string;
    desc: string;
}
const linkList = ref<Link[]>([
    {
        name:'南生论坛',
        logo:'data:image/png;base64,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',
        url:'https://bbs.nansin.top/links',
        desc:'南生论坛，一个专注于分享和交流的论坛，提供各种资源和工具，帮助用户更好地学习和成长。'
    }
])
function handleClick(url: string) {
    window.open(url, '_blank')
}
</script>