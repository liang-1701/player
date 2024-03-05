<template>
    <div class="container-search-music">
        <div class="platform">
            <span v-for="item in musicStore.menus?.meta.platform" :class="{'active':musicStore.currSearchPlat.id==item.id}" @click="changePlat(item.id)">
            {{ item.name }}</span>
        </div>
        <div class="category">
            <span @click="showCategory=0" :class="{'active':showCategory==0}">歌曲</span>
            <span @click="showCategory=1" :class="{'active':showCategory==1}">歌单</span>
            <span @click="showCategory=2" :class="{'active':showCategory==2}">歌手</span>
            <span @click="showCategory=3" :class="{'active':showCategory==3}">专辑</span>
        </div>
        <ul class="songs" v-show="showCategory==0">
            <li v-for="(item, index) in musicStore.search.songs" :key="item.id" :class="{playing:item.id==playMusicStore.currPlaySong.id}">
                <div class="index">{{ index + 1 }}</div>
                <div class="name">
                    <span>{{ item.name }}</span>
                    <div class="control">
                        <play-one @click="playMusicStore.play(item)" :class="{hide:musicEnevt.playState.value&&item.id==playMusicStore.currPlaySong.id}" theme="filled" size="24" fill="#333"/>
                        <pause @click="playMusicStore.play(item)" :class="{hide:!(musicEnevt.playState.value&&item.id==playMusicStore.currPlaySong.id)}" theme="filled" size="24" fill="#333"/>
                        <plus @click="playMusicStore.addSong(item)" theme="filled" size="24" fill="#333"/>
                    </div>    
                </div>
                <div class="singer">
                    <span @click="musicEnevt.getSingerDetail(singer)" v-for="(singer, i) in item.singers">
                        {{ singer.name }}
                        <span v-if="i < item.singers.length - 1">, </span>  
                    </span>
                </div>
                <div class="album" @click="musicEnevt.getAlbum(item.album)">{{ item.album.name }}</div>
                <div class="time">{{ item.time }}</div>
            </li>
        </ul>
        <ul class="squares" v-show="showCategory==1">
            歌单
        </ul>
        <ul class="singers" v-show="showCategory==2">
            歌手
        </ul>
        <ul class="albums" v-show="showCategory==3">
            专辑
        </ul>
    </div>
</template>

<script  lang="ts" setup>
import { PlayOne, Pause, Plus } from '@icon-park/vue-next'
import musicResource from "@/store/modules/musicResource";
import playMusic from "@/store/modules/playMusic";
import { inject, ref } from "vue";

let musicStore = musicResource();
let playMusicStore = playMusic();
const musicEnevt:any = inject("music-enevt");
const showCategory = ref(0);

const changePlat = (id:string) => {
    const plat = musicStore.menus!.meta.platform!.find((item:any) => item.id == id);
    musicStore.currSearchPlat = plat;
}
</script>

<style lang="scss" scoped>
.container-search-music {
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    .platform {
        margin-left: 20px;
        font-size: 20px;
        span {
            display: inline-block;
            border-radius: 5px;
            padding: 2px 5px;
            margin-right: 20px;
            cursor: pointer;
            &:not(.active):hover {
                background-color: var(--button-color-hover);
                transition:transform 0.3s ease-in;
            }
            &.active {
                background-color: var(--button-color-active);
                transition: background-color 0.3s ease-in;
            }
        }
    }
    .category {
        margin-left: 20px;
        font-size: 20px;
        margin-top: 10px;
        span {
            margin-right: 20px;
            cursor: pointer;
            position: relative;
            &:hover {
                color: var(--text-color-hover);
            }
            &.active {
                color: var(--text-color-active);
            }
            &.active::after {
                content: "";
                display: inline-block;
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0;
                margin-bottom: -4px;
                border-bottom: 3px solid var(--text-color-active);
            }
        }
    }
    .songs {
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
            .singer {
                flex: 2;
                span:hover {
                    cursor: pointer;
                    color: var(--text-color-hover);
                }
            }
            .album {
                flex: 2;
                &:hover {
                    cursor: pointer;
                    color: var(--text-color-hover);
                }
            }
            .time {
                width: 60px;
            }
        }
    }
}
            
</style>