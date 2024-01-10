<template>
    <div class="container-categoryDetail">
        <div class="category-title">
            <div class="img">
                <img :src="musicStore.musicListDetail.img" alt="">
            </div>
            <div class="title-content">
                <span class="title"  v-html="musicStore.musicListDetail.title"></span>
                <span class="desc" v-html="musicStore.musicListDetail.desc"></span>
                <span class="time" v-if="musicStore.musicListDetail.updateTime">最后更新时间: {{ musicStore.musicListDetail.updateTime }} </span>
                <div class="control">
                    <div class="play">
                        <svg t="1704021546119" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4214" width="15" height="15"><path d="M224 938.713333a53.58 53.58 0 0 1-53.333333-53.433333V138.72a53.333333 53.333333 0 0 1 80.886666-45.666667l618.666667 373.28a53.333333 53.333333 0 0 1 0 91.333334l-618.666667 373.28a53.16 53.16 0 0 1-27.553333 7.766666z m0.046667-810.666666a10.98 10.98 0 0 0-5.333334 1.42 10.466667 10.466667 0 0 0-5.38 9.253333v746.56a10.666667 10.666667 0 0 0 16.18 9.133333l618.666667-373.28a10.666667 10.666667 0 0 0 0-18.266666l-618.666667-373.28a10.386667 10.386667 0 0 0-5.446666-1.586667z" fill="#5C5C66" p-id="4215"></path></svg>
                        <span>播放全部</span>
                    </div>
                    <span class="add" @click="playStore.clearAndAdd(musicStore.musicListDetail.list)">仅添加列表</span>
                </div>
            </div>
        </div>
        <span class="count">列表({{ musicStore.musicListDetail.list?.length }})</span>
        <ul class="music-list">
            <li v-for="(item, index) in musicStore.musicListDetail.list" :key="item.mid">
                <div class="index">
                    <span>{{ index + 1 }}</span>
                </div>
                <div class="name">
                    <span>{{ item.name }}</span>
                    <div class="control">
                        <svg t="1703991609601" class="icon play"  @click="" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5474" width="21" height="21"><path d="M870.2 466.333333l-618.666667-373.28a53.333333 53.333333 0 0 0-80.866666 45.666667v746.56a53.206667 53.206667 0 0 0 80.886666 45.666667l618.666667-373.28a53.333333 53.333333 0 0 0 0-91.333334z" fill="#5C5C66" p-id="5475"></path></svg>
                        <svg t="1703991646436" class="icon pause"  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5660" width="21" height="21"><path d="M426.666667 138.666667v746.666666a53.393333 53.393333 0 0 1-53.333334 53.333334H266.666667a53.393333 53.393333 0 0 1-53.333334-53.333334V138.666667a53.393333 53.393333 0 0 1 53.333334-53.333334h106.666666a53.393333 53.393333 0 0 1 53.333334 53.333334z m330.666666-53.333334H650.666667a53.393333 53.393333 0 0 0-53.333334 53.333334v746.666666a53.393333 53.393333 0 0 0 53.333334 53.333334h106.666666a53.393333 53.393333 0 0 0 53.333334-53.333334V138.666667a53.393333 53.393333 0 0 0-53.333334-53.333334z" fill="#5C5C66" p-id="5661"></path></svg>
                        <svg t="1703992365269" class="icon add" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11282" width="21" height="21"><path d="M925.696 384q19.456 0 37.376 7.68t30.72 20.48 20.48 30.72 7.68 37.376q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68l-287.744 0 0 287.744q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888l0-287.744-287.744 0q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68l287.744 0 0-287.744q0-19.456 7.68-37.376t20.48-30.72 30.208-20.48 37.888-7.68q39.936 0 68.096 28.16t28.16 68.096l0 287.744 287.744 0z" fill="#5C5C66" p-id="11283"></path></svg>
                    </div>
                </div>
                <div class="singer">
                    <span v-for="(singer, i) in item.singer">
                        {{ singer.name }}
                        <span v-if="i < item.singer.length - 1">, </span>  
                    </span>
                </div>
                <div class="album">
                    <span>{{ item.album.name }}</span>
                </div>
                <div class="time">
                    <span>{{ item.time }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script  lang="ts" setup>
import musicResource from "@/store/modules/musicResource";
import playMusic from "@/store/modules/playMusic";

let musicStore = musicResource();
let playStore = playMusic();
</script>

<style lang="scss" scoped>
$index-width: 30px;
$control-width: 50px;
$singer-width: 20%;
$album-width: 20%;
$time-width: 50px;
$name-width: calc(100% - $index-width - $singer-width - $album-width - $time-width - 100px);
.category-title {
    display: flex;
    align-items: center;
    margin-left: 30px;
    .img img{
        width: 150px;
        border-radius: 20px;
    }
    .title-content {
        height: 150px;
        width: 80%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 20px;
        .title {
            font-size: 30px;
        }
        .desc {
            font-size: 14px;
            width: 70%;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .time {
            font-size: 12px;
        }
        .control {
            display: flex;
            flex-direction: row;
            align-items: center;
            .play, .add {
                margin: 0 10px;
                font-size: 12px;
                line-height: 30px;
                border-radius: 15px;
                padding: 0 10px;
                display: flex;
                align-items: center;
                background-color: var(--text-color-active);
                cursor: pointer;
            }
            .play:hover, .add:hover{
                transform: scale(1.05);
            }
        }
    }
}
.count {
    display: inline-block;
    margin: 30px 0 0 30px;
    color: var(--text-color-active);
}
.music-list {
    list-style: none;
    padding: 0;
    li {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        border-radius: 10px;
        > div {
            float: left;
            margin: 0 0 0 10px;
            line-height: 40px;
        }
        .index {
            min-width: $index-width;
            span {
                float: right;
            }
        }
        .name {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: $name-width;
            span {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                width: 100%;
            }
            .control {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: $control-width;
                cursor: pointer;
                display: none;
                svg:hover path {
                    fill: var(--control-btn-color);
                }
                .pause {
                    display: none;
                }
            }
        }
        .singer {
            width: $singer-width;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .album {
            width: $album-width;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .time {
            width: $time-width;
            float: right;
            margin-right: 40px;
            span {
                float: right;
            }
        }
    }
    li:hover .control {
        display: block;
    }
    li:hover {
        background-color: var(--music-detail-list-hover-color);
    }
}
.container-categoryDetail {
    overflow-y: auto;
}
.container-categoryDetail::-webkit-scrollbar {
    width: 10px;
}
.container-categoryDetail::-webkit-scrollbar-thumb {
    background: var(--scrollbar-color);
    border-radius: 6px;
}
</style>