<template>
    <div class="container-album-detail">
        <div class="album-info">
            <img v-lazy="musicStore.albumDetail.img" alt="">
            <div class="content">
                <span class="name">{{ musicStore.albumDetail.name }}</span>
                <span class="desc" v-html="musicStore.albumDetail.desc"></span>
                <span class="time">发行时间: {{ musicStore.albumDetail.time }}</span>
                <div class="control">
                    <add-music @click="playMusicStore.addSongList(musicStore.albumDetail.songs);playMusicStore.play(musicStore.albumDetail.songs![0])" theme="filled" size="24" fill="#333"/>
                    <list-add @click="playMusicStore.addSongList(musicStore.albumDetail.songs)" theme="filled" size="24" fill="#333"/>
                </div>
            </div>
        </div>
        <ul class="song-list">
            <li v-for="(item, index) in musicStore.albumDetail.songs" :key="item.id" :class="{playing:item.id==playMusicStore.currPlaySong.id}">
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
                <div class="time">{{ item.time }}</div>
            </li>
        </ul>
    </div>
</template>

<script  lang="ts" setup>
import { AddMusic, ListAdd, PlayOne, Pause, Plus } from '@icon-park/vue-next'
import musicResource from "@/store/modules/musicResource";
import playMusic from "@/store/modules/playMusic";
import { inject } from "vue";

let musicStore = musicResource();
let playMusicStore = playMusic();
const musicEnevt:any = inject("music-enevt");
</script>

<style lang="scss" scoped>
.container-album-detail {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    .album-info {
        display: flex;
        > * {
            margin: 0 20px;
        }
        img {
            width: 150px;
            height: 150px;
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
            .desc {
                flex: 1;
                margin: 5px 0;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: scroll;
                white-space: break-spaces;
                &::-webkit-scrollbar {
                    display: none;
                }
            }
            .time {
                font-size: 14px;
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
            .singer {
                flex: 2;
                span:hover {
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