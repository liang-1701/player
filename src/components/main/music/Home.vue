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
    console.log("getSingerDetail1111111", singer);
    musicStore.getSingerDetail(singer, 1);
    $router.push('/singerDetail')
}

eventBus.on("audio-play-state", (data) => {
    playState.value =  Boolean(data);
    // 通知歌词面板
    window.api.playStatetoLyric(JSON.parse(JSON.stringify(playMusicStore.currPlaySong.lyrics||[])));
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
    window.api.openLyric(lyricOpen.value, playState.value, JSON.parse(JSON.stringify(playMusicStore.currPlaySong.lyrics||[])));
    lyricOpen.value = !lyricOpen.value;
}

window.api.changeLyricState(() =>{
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