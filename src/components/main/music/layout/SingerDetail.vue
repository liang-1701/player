<template>
    <div class="container-singer-detail">
        <div class="singer-info">
            <img v-lazy="musicStore.singerDetail.img" alt="">
            <div class="content">
                <span class="name">{{ musicStore.singerDetail.name }}</span>
                <div class="category">
                    <span :class="{active:active==0}" @click="showList=musicStore.singerDetail.recommend;active=0">精选</span>
                    <span :class="{active:active==1}" @click="active=1;getSongsBySinger();">单曲({{ musicStore.singerDetail.songsTotal }})</span>
                    <span :class="{active:active==2}" @click="getAlbums();active=2">专辑</span>
                </div>
                <div class="control">
                    <add-music @click="playMusicStore.addSongList(showList);playMusicStore.play(showList![0])" theme="filled" size="24" fill="#333"/>
                    <list-add @click="playMusicStore.addSongList(showList)" theme="filled" size="24" fill="#333"/>
                </div>
            </div>
        </div>
        <ul class="song-list" v-show="active==0||active==1">
            <li v-for="(item, index) in showList" :key="item.id" :class="{playing:item.id==playMusicStore.currPlaySong.id}">
                <div class="index">{{ index + 1 }}</div>
                <div class="name">
                    <span>{{ item.name }}</span>
                    <div class="control">
                        <play-one @click="playMusicStore.play(item)" :class="{hide:musicEnevt.playState.value&&item.id==playMusicStore.currPlaySong.id}" theme="filled" size="24" fill="#333"/>
                        <pause @click="playMusicStore.play(item)" :class="{hide:!(musicEnevt.playState.value&&item.id==playMusicStore.currPlaySong.id)}" theme="filled" size="24" fill="#333"/>
                        <plus @click="playMusicStore.addSong(item)" theme="filled" size="24" fill="#333"/>
                    </div>    
                </div>
                <div class="album" @click="musicEnevt.getAlbum(item.album)">{{ item.album.name }}</div>
                <div class="time">{{ item.time }}</div>
            </li>
        </ul>
        <div class="albums" v-show="active==2">
            <div class="album" v-for="item in albumsList" @click="musicEnevt.getAlbum(item)">
                <div class="img" >
                    <img v-lazy="item.img">
                    <div class="cover">
                        <play theme="filled" size="40" fill="#333"/>
                    </div>
                </div>
                <div class="name">{{ item.name }}</div>
                <div class="time">{{ item.time }}</div>
            </div>
        </div>
        <div v-show="loader" class="loader"></div>
        <div v-show="!loader" class="no-more">没有更多了</div>
    </div>
</template>

<script  lang="ts" setup>
import { AddMusic, ListAdd, PlayOne, Pause, Plus, Play } from '@icon-park/vue-next'
import musicResource from "@/store/modules/musicResource";
import playMusic from "@/store/modules/playMusic";
import { ref, inject, onMounted, onUnmounted, onActivated } from 'vue';

let musicStore = musicResource();
let playMusicStore = playMusic();
const musicEnevt:any = inject("music-enevt");
const showListLenth = ref(0);
const showList = ref(musicStore.singerDetail.recommend);
const albumsList = ref(musicStore.singerDetail.albums);
const active = ref(0);
const page = ref(1);
const loader = ref(true);

const getAlbums = async () => {
    const singer = {
            id: musicStore.singerDetail.id,
            name: musicStore.singerDetail.name
    }
    page.value = 1;
    await musicStore.getAlbumsBySinger(singer, page.value);
    albumsList.value = musicStore.singerDetail.albums;
    showListLenth.value = 0;
    loader.value = true;
}

const getSongsBySinger = async () => {
    const singer = {
            id: musicStore.singerDetail.id,
            name: musicStore.singerDetail.name
    }
    page.value = 1;
    await musicStore.getSongsBySinger(singer, page.value);
    showList.value = musicStore.singerDetail.songs;
    showListLenth.value = 0;
    loader.value = true;
}

const ob = new IntersectionObserver(async (entries) => {
        if(entries[0].isIntersecting) {
            const singer = {
                id: musicStore.singerDetail.id,
                name: musicStore.singerDetail.name
            }
            page.value += 1;
            if(active.value == 0) {
                await musicStore.getSingerDetail(singer, page.value);
            } else if(active.value == 1) {
                await musicStore.getSongsBySinger(singer, page.value);
            } else if(active.value == 2) {
                await musicStore.getAlbumsBySinger(singer, page.value);
            }
            if(showListLenth.value == showList.value?.length) {
                loader.value = false;
            } else {
                if(active.value == 2) {
                    showListLenth.value = albumsList.value?.length || 0;
                }else {
                    showListLenth.value = showList.value?.length || 0;
                }
                loader.value = true;
            }
        }
    }, 
    {
        root: null,
        threshold: 0.1
    }
)
    
onMounted(() => {
    ob.observe(document.querySelector(".loader") as HTMLElement);
})

onUnmounted(() => {
    ob.disconnect();
})
    
onActivated(() => {
    showList.value = musicStore.singerDetail.recommend;
    showListLenth.value = 0;
    active.value = 0;
    page.value = 1;
    loader.value = true;
})

</script>

<style lang="scss" scoped>
.container-singer-detail {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    .singer-info {
        display: flex;
        > * {
            margin: 0 20px;
        }
        img {
            width: 120px;
            height: 120px;
            border-radius: 20px;
        }
        .content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .name {
                font-size: 20px;
                font-weight: 700;
            }
            .category {
                margin-top: 30px;
                span {
                    margin-right: 30px;
                    cursor: pointer;
                    &:hover {
                        color: var(--text-color-hover);
                    }
                    &.active {
                        color: var(--text-color-active);
                    }
                }
            }
            
            .control {
                display: flex;
                align-items: center;
                > * {
                    margin: 0 5px;
                    cursor: pointer;
                    &:hover :deep(path) {
                        stroke:var(--icon-color-hover);
                    }
                    &:hover :deep(path:nth-child(2)) {
                        fill: var(--icon-color-hover);
                    }
                }
            }
        }
    }
    .song-list {
        list-style: none;
        padding: 0;
        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 10px;
            line-height: 40px;
            &.playing {
                color: var(--li-active);
            }
            > * {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 0 10px;
                box-sizing: border-box;
            }
            .index {
                width: 50px;
            }
            .name {
                flex: 4;
                display: flex;
                align-items: center;
                justify-content: space-between;
                span {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .control {
                    display: none;
                    line-height: 100%;
                    cursor: pointer;
                    > *:hover :deep(path) {
                        fill: var(--icon-color-hover);
                        stroke: var(--icon-color-hover);
                    }
                    .hide {
                        display: none;
                    }
                }
            }
            &:hover {
                background-color: var(--li-hover-bg-color);
                .name .control {
                    display: block;
                }
            }
            .album {
                flex: 2;
            }
            .time {
                width: 60px;
            }
        }
    }
    .albums {
        .album {
            display: inline-block;
            margin: 20px;
            width: 125px;
            height: 170px;
            border-radius: 5px;
            box-shadow:  0 0 6px #c5c5c5, 0 0 6px #ffffff;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            &:hover {
                transform: scale(1.1);
            }
            .img {
                position: relative;
                width: 125px;
                height: 125px;
                .cover {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: rgba(#a9a6a6, 0.6);
                    visibility: hidden;
                }
                &:hover .cover {
                    visibility: visible;
                }
                .cover > *:hover :deep(path:first-child) {
                    fill: var(--icon-color-hover);
                    stroke: var(--icon-color-hover);
                }
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .name {
                overflow: hidden;
                font-size: 14px;
                margin: 5px 2px 0 2px;
            }
            .time {
                font-size: 12px;
            }
            .name:hover {
                color: var(--text-color-hover);
            }
        }
    }
    .loader {
        margin: auto;
        width: fit-content;
        font-size: 20px;
        clip-path: inset(0 2ch 0 0);
        animation: loading 1s steps(4) infinite;
        &::before {
            content:"加载中..."
        }
        @keyframes loading {to{clip-path: inset(0 -1ch 0 0)}}
    }
    .no-more {
        margin: auto;
        font-size: 20px;
    }
}
</style>