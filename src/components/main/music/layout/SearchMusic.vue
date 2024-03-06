<template>
    <div class="container-search-music">
        <div class="platform">
            <span v-for="item in musicStore.menus?.meta.platform" :class="{'active':musicStore.currSearchPlat.id==item.id}" @click="changePlat(item.id)">
            {{ item.name }}</span>
        </div>
        <div class="category">
            <span @click="showCategory=0;search();" :class="{'active':showCategory==0}">歌曲</span>
            <span @click="showCategory=1;search();" :class="{'active':showCategory==1}">歌单</span>
            <span @click="showCategory=2;search();" :class="{'active':showCategory==2}">歌手</span>
            <span @click="showCategory=3;search();" :class="{'active':showCategory==3}">专辑</span>
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
            <div v-show="loader" class="loader"></div>
            <div v-show="!loader" class="no-more">没有更多了</div>
        </ul>
        <div class="specials" v-show="showCategory==1">
            <div class="special" v-for="item in musicStore.search.specials" @click="musicStore.getSquareDetail(item.id, item.group, item.data);$router.push('/squareDetail');">
                <div class="img" >
                    <img v-lazy="item.imgUrl" @load="">
                    <div class="cover">
                        <play theme="filled" size="40" fill="#333"/>
                    </div>
                </div>
                <div class="title">{{ item.title }}</div>
            </div>
            <div v-show="loader" class="loader"></div>
            <div v-show="!loader" class="no-more">没有更多了</div>
        </div>
        <div class="singers" v-show="showCategory==2">
            <div class="singer" v-for="singer in musicStore.search.singers" @click="musicEnevt.getSingerDetail(singer)">
                <div class="img" >
                    <img v-lazy="singer.img" alt="">
                    <div class="cover">
                        <play theme="filled" size="40" fill="#333"/>
                    </div>
                </div>
                <span class="name">{{ singer.name }}</span>
            </div>
            <div v-show="loader" class="loader"></div>
            <div v-show="!loader" class="no-more">没有更多了</div>
        </div>
        <div class="albums" v-show="showCategory==3">
            <div class="album" v-for="item in musicStore.search.albums" @click="musicEnevt.getAlbum(item)">
                <div class="img" >
                    <img v-lazy="item.img">
                    <div class="cover">
                        <play theme="filled" size="40" fill="#333"/>
                    </div>
                </div>
                <div class="name">{{ item.name }}</div>
                <div class="time">{{ item.time }}</div>
            </div>
            <div v-show="loader" class="loader"></div>
            <div v-show="!loader" class="no-more">没有更多了</div>
        </div>
    </div>
</template>

<script  lang="ts" setup>
import { PlayOne, Pause, Plus, Play } from '@icon-park/vue-next'
import musicResource from "@/store/modules/musicResource";
import playMusic from "@/store/modules/playMusic";
import { inject, ref, onMounted, onUnmounted } from "vue";

let musicStore = musicResource();
let playMusicStore = playMusic();
const musicEnevt:any = inject("music-enevt");
const showCategory = ref(0);
const showListLenth = ref(0);
const page = ref(1);
const loader = ref(true);

const changePlat = (id:string) => {
    const plat = musicStore.menus!.meta.platform!.find((item:any) => item.id == id);
    musicStore.currSearchPlat = plat;
}

const search = async () => {
    page.value = 1;
    if(showCategory.value == 0) {
        await musicStore.searchSongs(musicStore.search.keywords, page.value);
    } else if(showCategory.value == 1) {
        await musicStore.searchSpecials(musicStore.search.keywords, page.value);
    } else if(showCategory.value == 2) {
        await musicStore.searchSingers(musicStore.search.keywords, page.value);
    } else if(showCategory.value == 3) {
        await musicStore.searchAlbums(musicStore.search.keywords, page.value);
    }
    showListLenth.value = 0;
    loader.value = true;
}

const ob = new IntersectionObserver(async (entries) => {
        if(entries[0].isIntersecting) {
            page.value += 1;
            let count = 0;
            if(showCategory.value == 0) {
                await musicStore.searchSongs(musicStore.search.keywords, page.value);
                count = musicStore.search.songs?.length;
            } else if(showCategory.value == 1) {
                await musicStore.searchSpecials(musicStore.search.keywords, page.value);
                count = musicStore.search.specials?.length;
            } else if(showCategory.value == 2) {
                await musicStore.searchSingers(musicStore.search.keywords, page.value);
                count = musicStore.search.singers?.length;
            } else if(showCategory.value == 3) {
                await musicStore.searchAlbums(musicStore.search.keywords, page.value);
                count = musicStore.search.albums?.length;
            }
            if(showListLenth.value == count) {
                loader.value = false;
            } else {
                loader.value = true;
                showListLenth.value = count;
            }
        }
    }, 
    {
        root: null,
        threshold: 0.1
    }
)

onMounted(() => {
    const loader  = document.querySelectorAll(".loader") as unknown as HTMLElement[];
    for (let i = 0; i < loader.length; i++) {
        let el = loader[i];
        ob.observe(el);
    }
})

onUnmounted(() => {
    ob.disconnect();
})
</script>

<style lang="scss" scoped>
.container-search-music {
    display: flex;
    flex-direction: column;
    padding-left: 20px;
    .songs, .specials, .singers, .albums {
        margin: 10px 0;
        flex-wrap: wrap;
        overflow-y: auto;
        overflow-x: hidden;
    }
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
    .specials {
        .special {
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
            .title {
                overflow: hidden;
                font-size: 12px;
                margin: 5px 2px 0 2px;
            }
            .title:hover {
                color: var(--text-color-hover);
            }
        }
    }
    .singers {
        display: flex;
        .singer {
            display: inline-block;
            margin: 20px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            .img {
                position: relative;
                width: 125px;
                height: 125px;
                .cover {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    border-radius: 50%;
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
                    border-radius: 50%;
                }
            }
            .name {
                margin-top: 10px;
                font-size: 14px;
                &:hover {
                    color: var(--text-color-hover);
                }
            }
            &:hover {
                transform: scale(1.1);
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