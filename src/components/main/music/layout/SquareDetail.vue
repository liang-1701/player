<template>
    <div class="container-square-detail">
        <div class="square">
            <img v-lazy="musicStore.squareDetail.img">
            <div class="content">
                <span class="name" v-html="musicStore.squareDetail.name"></span>
                <span class="desc" v-html="musicStore.squareDetail.desc"></span>
                <span class="time" v-if="musicStore.squareDetail.updateTime">最后更新时间: {{ musicStore.squareDetail.updateTime }}</span>
                <div class="control">
                    <add-music theme="filled" size="24" fill="#333"/>
                    <list-add theme="filled" size="24" fill="#333"/>
                </div>
            </div>
        </div>
        <span class="song-count">列表({{ musicStore.squareDetail.songs?.length }})</span>
        <ul class="song-list">
            <li v-for="(item, index) in musicStore.squareDetail.songs" :key="item.id">
                <div class="index">{{ index + 1 }}</div>
                <div class="name">
                    <span>{{ item.name }}</span>
                    <div class="control">
                        <play-one theme="filled" size="24" fill="#333"/>
                        <pause theme="filled" size="24" fill="#333"/>
                        <plus theme="filled" size="24" fill="#333"/>
                    </div>    
                </div>
                <div class="singer">
                    <span v-for="(singer, i) in item.singers">
                        {{ singer.name }}
                        <span v-if="i < item.singers.length - 1">, </span>  
                    </span>
                </div>
                <div class="album">{{ item.album.name }}</div>
                <div class="time">{{ item.time }}</div>
            </li>
        </ul>
    </div>
</template>

<script  lang="ts" setup>
import { AddMusic, ListAdd, PlayOne, Pause, Plus } from '@icon-park/vue-next'
import musicResource from "@/store/modules/musicResource";

let musicStore = musicResource();
</script>

<style lang="scss" scoped>
.container-square-detail {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    box-sizing: border-box;
    .square {
        display: flex;
        justify-content: space-between;
        img {
            width: 150px;
            height: 150px;
            border-radius: 10px;
        }
        .content {
            flex: 1;
            margin-left: 20px;
            display: flex;
            flex-direction: column;
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
                overflow: hidden;
                white-space: break-spaces;
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
    .song-count {
        margin-top: 30px;
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
            > * {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                padding: 0 10px;
                box-sizing: border-box;
            }
            .index {
                width: 40px;
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
            }
            .album {
                flex: 2;
            }
            .time {
                width: 60px;
            }
        }
    }
}
</style>