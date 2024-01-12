<template>
    <div class="container">
        <Left class="left" />
        <router-view v-slot="{ Component }" class="content">
            <KeepAlive>
                <component :is="Component"/>
            </KeepAlive>
        </router-view>
        <Play class="play" />
    </div>
</template>

<script  lang="ts" setup>
import Left from '@/components/main/music/layout/Left.vue'
import Play from '@/components/main/music/layout/Play.vue';
// import { onMounted } from 'vue'
// import musicResource from "@/store/modules/musicResource";

// let musicStore = musicResource();

// onMounted(() => {
//     musicStore.init()
//  })
</script>

<style lang="scss" scoped>
$left-width: 150px;
$show-play-height: 70px;
.left {
    width: $left-width;
    height: 100%;
}
.content {
    width: calc(100% - $left-width);
    left: $left-width;
    height: calc(100% - $show-play-height);
}
.container {
    display: flex;
    .play {
        position: fixed;
        width: 100%;
        margin-left: calc($left-width + 10px);
        height: $show-play-height;
        width: calc(100% - 180px);
        bottom: 0;
        overflow: hidden;
    }
}
</style>