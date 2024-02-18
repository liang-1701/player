<template>
    <div class="container-play">
        <!-- 播放进度条 -->
        <input type="range" class="play-progress" min="0" max="1" step="0.0001" :value="currentTimeVal">
        <div class="play-show">
            <div class="play-info">
                <img :src="musicbg" alt="">
                <div class="info">
                    <div class="name">
                        <span>听点什么</span>
                    </div>
                    <div class="time">
                        <span class="current-time">00:00</span>
                        <span>/</span>
                        <span class="total-time">00:00</span>
                    </div>
                </div>
            </div>
            <div class="play-control">
                <go-start theme="filled" size="24" fill="#333"/>
                <play :class="{'play-button-hide':playState}" theme="filled" size="34" fill="#333"/>
                <pause-one :class="{'play-button-hide':!playState}" theme="filled" size="34" fill="#333"/>
                <go-end theme="filled" size="24" fill="#333"/>
                <music-list @click.stop="playQueueOpen=!playQueueOpen" theme="filled" size="24" fill="#333"/>
            </div>
            <div class="play-Volume">
                <volume-mute :class="{hide:!isMute}" theme="filled" size="24" fill="#333"/>
                <volume-small :class="{hide:isMute || playVolumeVal>0.4}" theme="filled" size="24" fill="#333"/>
                <volume-notice :class="{hide:isMute || playVolumeVal<=0.4}" theme="filled" size="24" fill="#333"/>
                <!-- 声音调节 -->
                <input type="range" class="volume-progress" min="0" max="1" step="0.0001" :value="playVolumeVal">
            </div>
        </div>
        <!-- 播放列表 -->
        <div class="play-queue" :class="{show:playQueueOpen}"  @click.stop="playQueueOpen==true">
            <div class="header">
                <span>播放队列({{ playStore.playQueue?.length }})</span>
                <div class="control">
                    <list theme="filled" size="20" fill="#333"/>
                    <delete theme="outline" size="20" fill="#333"/>
                </div>
            </div>
            <ul>
                <li>
                    <div class="info">
                        <span>歌曲名字test歌曲测试呢同是打算开发12345678</span>
                        <div class="singer-time">
                            <span class="singer">歌手名字</span>
                            <span class="time">04:00</span>
                        </div>
                    </div>
                    <div class="control">
                        <play-one theme="filled" size="20" fill="#333"/>
                        <pause theme="filled" size="20" fill="#333"/>
                        <delete-one theme="outline" size="17" fill="#333"/>
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
    </div>
</template>

<script  lang="ts" setup>
import { Play, PauseOne, GoStart, GoEnd, VolumeMute, VolumeSmall, VolumeNotice, MusicList, PlayOne, Pause, List, Delete, DeleteOne } from '@icon-park/vue-next'
import playMusic from "@/store/modules/playMusic";
import { ref } from "vue";
// import { eventBus } from "@/common/eventBus";
// import { formatTime, toSeconds } from '@/common/utils'
import musicbg from '@/assets/imgs/musicbg.png'

const currentTimeVal = ref(0)
const playVolumeVal = ref(0.2)
const isMute = ref(false)
const playState = ref(false)
const playQueueOpen = ref(true);  // 播放列表控制
let playStore = playMusic();
// const playState = ref(false)
// const currentTime = ref(0)
// const stopUpdate = ref(false)
// const isMute = ref(false)

document.addEventListener("click", () =>{playQueueOpen.value = false;console.log(playQueueOpen.value);})
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
    }
    .play-show {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .play-info {
            display: flex;
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
        }
        .play-Volume {
            display: flex;
            align-items: center;
            > *{
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
                    }
                }
                .control {
                    flex-shrink: 0;
                    line-height: 100%;
                    cursor: pointer;
                    display: none;
                    > *:hover :deep(path) {
                        fill: var(--icon-color-hover);
                        stroke: var(--icon-color-hover);
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