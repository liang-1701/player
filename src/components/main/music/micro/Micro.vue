<template>
    <div class="container-micro" ref="micro">
        <div @mousedown="move" class="play-info" @mouseenter="lyricShow=false" @mouseleave="lyricShow=true">
            <div class="img" @click="showMainWindow">
                <img src="@/assets/imgs/musicbg.png" alt="" :class="[{running:playState}, {paused:!playState}]">
                <div class="cover">
                    <home class="showMain" @click="" theme="multi-color" size="30" :fill="['#333' ,'#333' ,'#333' ,'#333']"/>
                </div>
            </div>
            <div class="play-control" v-show="!lyricShow">
                <div class="control">
                    <go-start @click="prevSong" theme="filled" size="24" fill="#706363"/>
                    <play @click="togglePlayState" v-show="!playState" theme="multi-color" size="34" :fill="['#333' ,'#cfc4c4' ,'#333' ,'#333']" />
                    <pause-one @click="togglePlayState" v-show="playState" theme="multi-color" size="34" :fill="['#333' ,'#cfc4c4' ,'#333' ,'#333']"/>
                    <go-end @click="nextSong" theme="filled" size="24" fill="#706363"/>
                    <music-menu @click.stop="listShow = !listShow;scrollPlaying()" theme="filled" size="20" fill="#706363"/>
                </div>
                <div class="close">
                    <Close @click="closeMicro" theme="outline" size="16" fill="#706363" :strokeWidth="2"/>
                </div>
            </div>
            <div class="name-lyric" v-show="lyricShow">
                <span class="name">{{ song.name }}</span>
                <span class="lyric">{{ currLyric }}</span>
            </div>
        </div>
        <div class="list" :class="{active:listShow}">
            <ul>
                <li v-for="item in playList" :class="{playing:item.id==song.id}">
                    <span class="name">{{ item.name }}</span>
                    <div class="control">
                        <play-one @click="playSong(item)" v-show="!(playState&&item.id==song.id)" theme="filled" size="24" fill="#706363"/>
                        <pause @click="playSong(item)" v-show="playState&&item.id==song.id" theme="filled" size="24" fill="#706363"/>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script  lang="ts" setup>
import { Play, PauseOne, GoStart, GoEnd, MusicMenu, Close, Home, PlayOne, Pause } from '@icon-park/vue-next'
import { reactive, ref } from 'vue';
import { msToSeconds } from '@/common/utils'

const lyricShow = ref(true);
const listShow = ref(false);
const micro = ref<HTMLElement | null>(null);
let song = reactive<any>({});
const currLyric = ref('暂无歌曲');
const playState = ref(false);
const playList = ref<Record<string, any>[]>([]);

const playSong = (item:any) => {
    window.api.playSong(JSON.parse(JSON.stringify(item)));
}

window.api.sendPlayListFromMicro((data:any) => {
    playList.value = data;
})

const nextSong = () => {
    window.api.nextSong();
}
const prevSong = () => {
    window.api.prevSong();
}
const togglePlayState = () => {
    window.api.togglePlayState();
}

window.api.sendPlayStateFromMicro((data:boolean) => {
    playState.value = data;
})

window.api.sendSongFromMicro((data:any)=>{
    song = data;
})

window.api.timeUpdateFromMicro((currTime:any, _allTime:any)=>{
    updateLyric(currTime);
})

const updateLyric = (currTime:number) => {
    if(!song.lyrics) return;
    const lyrics = song.lyrics;
    for (let i = 0; i < lyrics.length; i++) {
        if (lyrics.length === 1) {
            currLyric.value = lyrics[0].txt;
        }
        if (msToSeconds(lyrics[i].time) <= currTime && lyrics[i + 1] && msToSeconds(lyrics[i + 1].time) > currTime) {
            currLyric.value = lyrics[i].txt;
            break;
        }
    }
}

window.api.initDataToMicro((state:boolean, data:any) => {
    playState.value = state;
    song = reactive(data.currPlaySong);
    playList.value = reactive(data.playQueue);
})

document.addEventListener('mouseover', (event:MouseEvent) => {
    if(event.target === micro.value) {
        window.api.setIgnoreMouseEventsToMicro(true);
    }else {
        window.api.setIgnoreMouseEventsToMicro(false);
    }
})

const move = (event:MouseEvent) => {
    const initPos = {x: event.x, y: event.y};
    const move = (event: MouseEvent) => {
        const dx = event.screenX - initPos.x;
        const dy = event.screenY - initPos.y;
        window.api.moveMicro({dx, dy})
    }
    
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', move);
    });
    document.addEventListener('mousemove', move);
}

const showMainWindow = () => {
    window.api.showMainWindow();
}

// 打开播放队列时滚动到当前播放歌曲
const scrollPlaying = () => {
    const queueList = document.querySelector(".list") as HTMLElement;
    const playing = queueList.getElementsByClassName("playing")[0] as HTMLElement;
    if(playing){
        const rect = playing.getBoundingClientRect();
        const desiredTopOffset = (queueList.clientHeight / 2) - (rect.height / 2);
        queueList.scrollTo({
            top: rect.top + queueList.scrollTop - desiredTopOffset,
            behavior: "smooth"
        })
        
    }
}

const closeMicro = () => {
    window.api.closeMicro();
}
</script>

<style lang="scss" scoped>
.container-micro{
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    .play-info{
        width: 100%;
        margin-top: 30px;
        height: 70px;
        background-color: var(--bg-color);
        display: flex;
        align-items: center;
        padding: 0 5px;
        position: relative;
        background-color: var(--micro-bg-color);
        .img {
            position: relative;
            top: -10px;
            img {
                width: 80px;
                height: 100%;
                border-radius: 50%;
                animation: play-img 5s linear infinite;
                animation-play-state: attr(data-play);
                &.running {
                    animation-play-state: running;
                }
                &.paused {
                    animation-play-state: paused;
                }
                @keyframes play-img {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            }
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
                background-color: rgba(#605e5e, 0.6);
                visibility: hidden;
                cursor: pointer;
                &>*:hover :deep(svg > *) {
                    fill: var(--icon-color-hover);
                    stroke: var(--icon-color-hover);
                }
            }
            &:hover .cover {
                visibility: visible;
            }
        }
        .play-control {
            display: flex;
            flex: 1;
            height: 100%;
            padding-right: 10px;
            border-radius: 10px;
            .control {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                > * {
                    margin: 0 2px;
                    cursor: pointer;
                    &:nth-child(2):hover :deep(path:first-child),
                    &:nth-child(3):hover :deep(path:first-child) {
                        fill: var(--icon-color-hover);
                        stroke: var(--icon-color-hover);
                    }
                    &:nth-child(1):hover :deep(path),
                    &:nth-child(4):hover :deep(path),
                    &:nth-child(5):hover :deep(path) {
                        fill: var(--icon-color-hover);
                        stroke: var(--icon-color-hover);
                    }
                }
            }
            .close {
                height: 100%;
                cursor: pointer;
                &:hover :deep(path) {
                    fill: var(--icon-color-hover);
                    stroke: var(--icon-color-hover);
                }
            }
        }
        .name-lyric {
            width: calc(100% - 100px);
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: hidden;
            white-space: nowrap;
            .name {
                width: 100%;
                margin-top: 5px;
                font-size: 12px;
                text-align: center;
            }
            .lyric {
                flex: 1;
                min-width: 100%;
                display: flex;
                float: left;
                align-items: center;
                justify-content: center;
                font-size: 16px;
            }
        }
    }
    .list {
        height: 0;
        background-color: #4e4949;
        background-color: var(--micro-bg-color);
        transition: all 0.3s;
        overflow-y: auto;
        &.active {
            height: calc(100% - 100px);
        }
        ul {
            list-style: none;
            padding: 5px;
            color: #fff;
            li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                .name {
                    flex: 1;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .control {
                    float: right;
                    display: none;
                    > * {
                        cursor: pointer;
                        vertical-align: middle;
                    }
                    > *:hover :deep(path) {
                        fill: var(--icon-color-hover);
                        stroke: var(--icon-color-hover);
                    }
                }
                &:hover {
                    background-color: #393838;
                    .control {
                        display: block;
                    }
                }
                &.playing {
                    color: var(--li-active);
                }
            }
        }
        &::-webkit-scrollbar {
            display: none;
        }
        &:hover::-webkit-scrollbar {
            display: block;
        }
        &::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #393838, #393838);
        }
    }
}
</style>