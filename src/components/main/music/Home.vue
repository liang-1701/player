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
import playMusic from "@/store/modules/playMusic";
import { useRouter } from 'vue-router';
import { eventBus } from "@/common/eventBus";

let $router = useRouter();
let musicStore = musicResource();
let playMusicStore = playMusic();
const defaultClass = ref();  // 默认平台
const playState = ref(false);  // 播放状态
const lyricOpen = ref(false);  // 歌词

const getAlbum = (album: any) => {
    musicStore.getAlbumDetail(album);
    $router.push('/albumDetail')
}

const getSingerDetail = (singer:any) => {
    musicStore.getSingerDetail(singer, 1);
    $router.push('/singerDetail')
}

eventBus.on("open-micro", () => {
    window.api.openMicro(playState.value, {currPlaySong:JSON.parse(JSON.stringify(playMusicStore.currPlaySong)), playQueue:JSON.parse(JSON.stringify(playMusicStore.playQueue))});
});

eventBus.on("audio-play-state", (data) => {
    playState.value =  Boolean(data);
    // 发送当前播放状态
    window.api.sendPlayState(playState.value);
    // 发送当前播放歌曲信息
    window.api.sendSong(JSON.parse(JSON.stringify(playMusicStore.currPlaySong)));
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

const openLyric = () => {
    window.api.openLyric(lyricOpen.value, playState.value, JSON.parse(JSON.stringify(playMusicStore.currPlaySong)));
    lyricOpen.value = !lyricOpen.value;
}

window.api.changeLyricStateFromMain(() =>{
    lyricOpen.value = false;
});

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
    initDefaultClass,
    getSingerDetail,
    getAlbum,
    openLyric
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