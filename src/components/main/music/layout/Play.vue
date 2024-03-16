<template>
    <div class="container-play">
        <!-- 播放进度条 -->
        <input type="range" data-time="00:00" style="--time-left:0" class="play-progress" min="0" max="1" step="0.0001" :value="currentTimeVal" @input="changeProgress" @mouseup="changeTime" @mousedown="stopUpdate=true">
        <div class="play-show">
            <div class="play-info">
                <div class="img" @click="playInfoShow = true">
                    <img :src="playMusicStore.currPlaySong.img || musicbg" alt="">
                    <double-down class="playInfoShow" theme="filled" size="24" fill="#333"/>
                </div>
                <div class="info">
                    <div class="name">
                        <span>{{ playMusicStore.currPlaySong.name||'听点什么' }}</span>
                    </div>
                    <div class="time">
                        <span class="current-time">{{ formatTime(currentTime) }}</span>
                        /
                        <span class="total-time">{{ playMusicStore.currPlaySong.time||'00:00' }}</span>
                    </div>
                </div>
            </div>
            <div class="play-control">
                <go-start @click="playMusicStore.prevMuisc" theme="filled" size="24" fill="#333"/>
                <play @click="changePlayState" :class="{'play-button-hide':musicEnevt.playState.value}" theme="filled" size="34" fill="#333"/>
                <pause-one @click="changePlayState" :class="{'play-button-hide':!musicEnevt.playState.value}" theme="filled" size="34" fill="#333"/>
                <go-end @click="playMusicStore.nextMusic" theme="filled" size="24" fill="#333"/>
                <music-list @click.stop="playQueueOpen=!playQueueOpen;scrollPlaying()" theme="filled" size="24" fill="#333"/>
                <span @click="musicEnevt.openLyric" class="lyric">词</span>
            </div>
            <div class="play-Volume">
                <div class="control" @click="mute">
                    <volume-mute :class="{hide:!isMute}" theme="filled" size="24" fill="#333"/>
                    <volume-small :class="{hide:isMute || playVolumeVal>0.4}" theme="filled" size="24" fill="#333"/>
                    <volume-notice :class="{hide:isMute || playVolumeVal<=0.4}" theme="filled" size="24" fill="#333"/>
                </div>
                <!-- 声音调节 -->
                <input type="range" class="volume-progress" min="0" max="1" step="0.01" :value="playVolumeVal" @input="changeVolume">
            </div>
        </div>
        <!-- 播放列表 -->
        <div class="play-queue" :class="{show:playQueueOpen}"  @click.stop="playQueueOpen==true">
            <div class="header">
                <span>播放队列({{ playMusicStore.playQueue?.length }})</span>
                <div class="control">
                    <list theme="filled" size="20" fill="#333"/>
                    <delete @click="playMusicStore.clearQueue" theme="outline" size="20" fill="#333"/>
                </div>
            </div>
            <ul class="queue-list">
                <li v-for="(item) in playMusicStore.playQueue" :class="{playing:item.id==playMusicStore.currPlaySong.id}">
                    <div class="info">
                        <span>{{ item.name }}</span>
                        <div class="singer-time">
                            <div class="singer">
                                <span v-for="(singer, i) in item.singers">
                                    {{ singer.name }}
                                    <span v-if="i < item.singers.length - 1">, </span>  
                                </span>
                            </div>
                            <span class="time">{{ item.time }}</span>
                        </div>
                    </div>
                    <div class="control">
                        <play-one @click="playMusicStore.play(item)" :class="{hide:musicEnevt.playState.value&&item.id==playMusicStore.currPlaySong.id}" theme="filled" size="20" fill="#333"/>
                        <pause @click="playMusicStore.play(item)" :class="{hide:!(musicEnevt.playState.value&&item.id==playMusicStore.currPlaySong.id)}" theme="filled" size="20" fill="#333"/>
                        <delete-one @click="playMusicStore.removeSong(item)" theme="outline" size="15" fill="#333"/>
                    </div>
                </li>
            </ul>
            <div class="foot">
                <label  @click.stop="playQueueOpen=false">
                    <music-list theme="filled" size="17" fill="#333"/>
                    <span>收起</span>
                </label>
            </div>
        </div>
        <PlayInfo @changePlayInfoShow="(newVal:boolean)=>{playInfoShow=newVal}" :playInfoShow="playInfoShow"/>
    </div>
</template>

<script  lang="ts" setup>
import { DoubleDown, Play, PauseOne, GoStart, GoEnd, VolumeMute, VolumeSmall, VolumeNotice, MusicList, PlayOne, Pause, List, Delete, DeleteOne } from '@icon-park/vue-next'
import playMusic from "@/store/modules/playMusic";
import { ref, inject, onMounted, provide } from "vue";
import { eventBus } from "@/common/eventBus";
import { formatTime, toSeconds } from '@/common/utils'
import musicbg from '@/assets/imgs/musicbg.png'
import PlayInfo from './PlayInfo.vue';

const currentTimeVal = ref(0)
const playVolumeVal = ref(0.2)
const isMute = ref(false)
const playQueueOpen = ref(false);  // 播放列表控制
const musicEnevt:any = inject("music-enevt");
const currentTime = ref(0)
const stopUpdate = ref(false)
const playInfoShow = ref(false)
let playMusicStore = playMusic();

eventBus.on("audio-time-update", (data) => {
    if(stopUpdate.value) return;
    const allTime = toSeconds(playMusicStore.currPlaySong.time||'00:00');
    currentTime.value = Number(data);
    const percent = currentTime.value / allTime;
    currentTimeVal.value = percent;
    upProgress();
    // 通知歌词面板当前播放时间
    window.api.timeUpdate(currentTime.value, allTime);
});

window.api.playSongFromMain((data:any) => {
    playMusicStore.play(data);
})
window.api.nextSongFromMain(() => {
    playMusicStore.nextMusic();
})
window.api.prevSongFromMain(() => {
    playMusicStore.prevMuisc();
})
window.api.togglePlayStateFromMain(() => {
    changePlayState();
})

const changeTime = () => {
    upProgress();
    eventBus.emit("audio-play-seek", currentTimeVal.value);
    stopUpdate.value = false;
}

const changeProgress = (payload: Event) => {
    const event = payload as MouseEvent;
    const el = event.target as HTMLInputElement;
    currentTimeVal.value = Number(el.value);
    if(!playMusicStore.currPlaySong || Object.keys(playMusicStore.currPlaySong).length == 0) {
        currentTimeVal.value = 0;
    };
    upProgress();
    upAfterProgress(el);
}

const upAfterProgress = (el: HTMLInputElement) => {
    el.dataset.time = formatTime(currentTimeVal.value * toSeconds(playMusicStore.currPlaySong.time));
    el.style.setProperty("--time-left", `${currentTimeVal.value * 100 - 4}%`);
}

const upProgress = () => {
    const percent = currentTimeVal.value;
    const playProgress = document.getElementsByClassName("play-progress") as unknown as HTMLInputElement[];
    for (let i = 0; i < playProgress.length; i++) {
        let el = playProgress[i];
        el.style.backgroundSize = `${percent * 100}% 100%`;
    }
}

const changePlayState = () => {
    eventBus.emit("audio-play-change");
}

document.addEventListener("click", () =>{playQueueOpen.value = false;})

eventBus.on("audio-play-next", playMusicStore.nextMusic);

//音量改变
const changeVolume = (payload: Event) => {
    const event = payload as MouseEvent;
    const el = event.target as HTMLInputElement;
    playVolumeVal.value = Number(el.value);
    setVolume();
}

const setVolume = () => {
    const percent = playVolumeVal.value;
    const playVolume = document.getElementsByClassName("volume-progress") as unknown as HTMLInputElement[];
    for (let i = 0; i < playVolume.length; i++) {
        let el = playVolume[i];
        el.style.backgroundSize = `${percent * 100}% 100%`;;
    }
    eventBus.emit("audio-play-volume", playVolumeVal.value);
    if(playVolumeVal.value == 0) {
        isMute.value = true;
    }else {
        isMute.value = false;
    }
    eventBus.emit("audio-play-mute", isMute.value);
}

// 静音
const mute = () => {
    isMute.value = !isMute.value;
    eventBus.emit("audio-play-mute", isMute.value);
    const playVolume = document.getElementsByClassName("volume-progress") as unknown as HTMLInputElement[];
    for (let i = 0; i < playVolume.length; i++) {
        let el = playVolume[i];
        el.style.backgroundSize = `${isMute.value ? 0 : playVolumeVal.value * 100}% 100%`;
    }
}

// 打开播放队列时滚动到当前播放歌曲
const scrollPlaying = () => {
    const queueList = document.getElementsByClassName("queue-list")[0] as HTMLElement;
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

onMounted(() =>{
    mute();
    setVolume();
})

provide('play-song-event', {
    currentTimeVal,
    currentTime,
    playVolumeVal,
    stopUpdate,
    isMute,
    playQueueOpen,
    changeTime,
    changeProgress,
    mute,
    changeVolume,
    changePlayState,
    scrollPlaying
})
</script>

<style lang="scss" scoped>
.container-play {
    display: flex;
    flex-direction: column;
    margin: 0 10px;
    .play-progress {
        appearance: none;
        height: 3px;
        border-radius: 15px;
        background: -webkit-linear-gradient(var(--progress-left-color), var(--progress-left-color)) no-repeat var(--progress-right-color);
        background-size: 0% 100%;
        position: relative;
        cursor: pointer;
        &::-webkit-slider-thumb {
            appearance: none;
            width: 10px;
            height: 10px;
            background-color: var(--progress-left-color);
            border-radius: 50%;
            opacity: 0;
        }
        &:hover::-webkit-slider-thumb {
            opacity: 1;
        }
        &:hover::after {
            content: attr(data-time);
            position: absolute;
            left: var(--time-left);
            bottom: 7px;
            background-color: var(--bg-color);
            padding: 2px 4px;
            border-radius: 5px;
            font-size: 14px;
        }
    }
    .play-show {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .play-info {
            display: flex;
            .img {
                position: relative;
                cursor: pointer;
                &:hover .playInfoShow {
                    visibility: visible;
                }
                .playInfoShow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    visibility: hidden;
                }
                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    animation: play-img 5s linear infinite;
                    animation-play-state: running;
                }
                @keyframes play-img {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            }
            .info {
                margin-left: 10px;
                width: 150px;
                display: flex;
                flex-direction: column;
                .name {
                    overflow: hidden;
                    white-space: nowrap;
                    span {
                        animation: text-scroll 5s linear infinite alternate;
                        float: left;
                        min-width: 100%;
                    }
                    @keyframes text-scroll {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(calc(150px - 100%)); }
                    }
                }
                .time {
                    opacity: 0.5;
                    >* {
                        margin: 0 2px;
                    }
                    .current-time, .total-time{
                        display: inline-block;
                        width: 25px;
                    }
                }
            }
        }
        .play-control {
            display: flex;
            justify-content: space-between;
            align-items: center;
            > *{
                margin: 0 5px;
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
                &.play-button-hide {
                    display: none;
                }
            }
            .lyric {
                font-size: 22px;
                &:hover {
                    color: var(--text-color-hover);
                }
            }
        }
        .play-Volume {
            display: flex;
            align-items: center;
            .control > *{
                cursor: pointer;
                &:hover :deep(path) {
                    fill: var(--icon-color-hover);
                    stroke: var(--icon-color-hover);
                }
                &.hide {
                    display: none;
                }
            }
            .volume-progress {
                appearance: none;
                margin: 0 10px;
                width: 100px;
                height: 3px;
                border-radius: 15px;
                background: -webkit-linear-gradient(var(--progress-left-color), var(--progress-left-color)) no-repeat var(--progress-right-color);
                background-size: 20% 100%;
                &::-webkit-slider-thumb {
                    appearance: none;
                    width: 10px;
                    height: 10px;
                    background-color: var(--progress-left-color);
                    border-radius: 50%;
                    cursor: pointer;
                    opacity: 0;
                }
                &:hover::-webkit-slider-thumb {
                    opacity: 1;
                }
            }
        }
    }
    .play-queue {
        position: fixed;
        height: 100%;
        width: 0;
        max-width: 350px;
        background-color: var(--bg-color);
        right: 0;
        top: 0;
        transition: all 0.3s;
        box-shadow: -8px 0 5px -5px #e0e0e0;
        display: flex;
        flex-direction: column;
        z-index: 1;
        &.show {
            width: 30%;
        }
        >* {
            padding: 0 10px;
        }
        .header {
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: bold;
            .control {
                >* {
                    margin: 0 5px;
                    cursor: pointer;
                    &:hover :deep(path) {
                        stroke: var(--icon-color-hover);
                    }
                }
            }
        }
        ul {
            flex: 1;
            list-style: none;
            margin: 0;
            overflow: auto;
            padding: 0;
            li {
                display: flex;
                justify-content: space-between;
                align-items: center;
                line-height: 20px;
                padding: 3px 20px 3px 10px;
                border-radius: 10px;
                &.playing {
                    color: var(--li-active);
                }
                .info {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: inline-block;
                    .singer-time {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        opacity: 0.6;
                        font-size: 12px;
                    }
                }
                .control {
                    line-height: 100%;
                    cursor: pointer;
                    display: none;
                    > * {
                        margin: 0 2px;
                        vertical-align: middle;
                    }
                    > *:hover :deep(path) {
                        fill: var(--icon-color-hover);
                        stroke: var(--icon-color-hover);
                    }
                    .hide {
                        display: none;
                    }
                }
                &:hover {
                    background-color: var(--li-hover-bg-color);
                    .control {
                        display: block;
                    }
                    .singer-time .time {
                        display: none;
                    }
                }
            }
        }
        .foot {
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            >* {
                cursor: pointer;
                &:hover {
                    color: var(--text-color-hover);
                    :deep(path) {
                        stroke: var(--icon-color-hover);
                    }
                }
            }
        }
    }
}
</style>