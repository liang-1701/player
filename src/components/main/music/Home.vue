<template>
    <div class="container-home">
        <Left class="left" />
        <Right class="right" />
    </div>
</template>

<script  lang="ts" setup>
import Left from "./layout/Left.vue"
import Right from "./layout/Right.vue"
import { provide, ref, onMounted } from "vue";
import musicResource from "@/store/modules/musicResource";
import { useRouter } from 'vue-router';
import { eventBus } from "@/common/eventBus";

let $router = useRouter();
let musicStore = musicResource();
const defaultClass = ref();  // 默认平台
const playState = ref(false);  // 播放状态

eventBus.on("audio-play-state", (data) => {
    playState.value =  Boolean(data);
});

const getSquare = (id: number|string, page: number) => {
    musicStore.getSquare(id, page);
}

const setDefaultClass = (id: number) => {
    defaultClass.value = id;
}

const initDefaultClass = () => {
    defaultClass.value = musicStore.categoriesDetail.find((item) => item.default)?.categoryId;
    getSquare(defaultClass.value, 1);
}

onMounted(async () => {
    const id = $router.currentRoute.value.params.id;
    const plat = musicStore.menus!.meta.platform!.find((item:any) => item.id == id);
    await musicStore.setCurrentPlat(plat);
    initDefaultClass()
})

provide("music-enevt", {
    defaultClass,
    playState,
    setDefaultClass,
    getSquare,
    initDefaultClass
})
</script>

<style lang="scss" scoped>
.container-home {
    padding-top: 10px;
    display: flex;
    .left {
        width: 150px;
    }
    .right {
        width: calc(100% - 150px);
    }
}
</style>