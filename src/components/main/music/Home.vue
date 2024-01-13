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
import { provide, ref, onMounted } from "vue";
import musicResource from "@/store/modules/musicResource";
import { useRouter } from 'vue-router';

let $router = useRouter();

let musicStore = musicResource();
const musicListOpen = ref(false)
const defaultClass = ref()

const getRadio = (id: number) => {
    musicStore.getCategoryDetailById(id);
}

const setDefaultClass = (id: number) => {
    defaultClass.value = id;
}

const initDefaultClass = () => {
    defaultClass.value = Number(musicStore.categoriesDetail.find((item) => item.default)?.categoryId);
    musicStore.getCategoryDetailById(defaultClass.value);
}

onMounted(async () => {
    const id = $router.currentRoute.value.params.id;
    const plat = musicStore.menus!.meta.platform!.find((item:any) => item.id == id);
    await musicStore.setCurrentPlat(plat);
    initDefaultClass()
})

provide("all-tag", {
    musicListOpen,
    defaultClass,
    setDefaultClass,
    getRadio,
    initDefaultClass
})
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