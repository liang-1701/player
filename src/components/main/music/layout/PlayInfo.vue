<template>
    <div ref="bg" class="container-info" :class="{show:playInfoShow}">
        <div class="header">
            <div class="header-win no-drag" v-if="winEnevt.plat.value!='darwin'">
                <Up @click="close" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
                <Minus @click="winEnevt.setMin()" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
                <Square @click="winEnevt.setMax()" v-if="!winEnevt.winMax.value" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
                <MinusTheTop @click="winEnevt.setMax()" v-else theme="outline" size="20" fill="#333" :strokeWidth="2"/>
                <Close  @click="winEnevt.setCls()" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
            </div>
            <div class="header-mac no-drag" v-else>
                <TrafficLight></TrafficLight>
                <Up @click="close" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
            </div>
        </div>
        <div class="body">
            <div class="info" v-show="playMusicStore.currPlaySong.name">
                <span class="name"> {{ playMusicStore.currPlaySong.name }} </span>
                <div class="singer">                    
                    <span @click="musicEnevt.getSingerDetail(singer);close()" v-for="(singer, i) in playMusicStore.currPlaySong.singers">
                        {{ singer.name }}
                        <span v-if="i < playMusicStore.currPlaySong.singers.length - 1">, </span>  
                    </span>
                </div>
                <span @click="musicEnevt.getAlbum(playMusicStore.currPlaySong.album);close()" class="album"> {{ playMusicStore.currPlaySong.album?.name }} </span>
                <img ref="img" :src="playMusicStore.currPlaySong.img||musicbg" alt="" @load="loadImg">
            </div>
            <div class="lyrics" v-show="playMusicStore.currPlaySong.name" >
                <ul>
                    <li v-for="(item) in playMusicStore.currPlaySong.lyrics" :data-time="item.time">{{ item.txt }}</li>
                </ul>
            </div>
        </div>
        <div class="foot">
            <!-- 播放进度条 -->
            <input type="range" data-time="00:00" style="--time-left:0" class="play-progress" min="0" max="1" step="0.0001" :value="playSongEvent.currentTimeVal.value" @input="playSongEvent.changeProgress" @mouseup="playSongEvent.changeTime" @mousedown="playSongEvent.stopUpdate.value=true">
            <div class="play-show">
                <div class="time">
                    <span class="current-time">{{ formatTime(playSongEvent.currentTime.value) }}</span>
                    <span>/</span>
                    <span class="total-time">{{ playMusicStore.currPlaySong.time||'00:00' }}</span>
                </div>
                <div class="play-control">
                    <go-start @click="playMusicStore.prevMuisc" theme="filled" size="24" fill="#333"/>
                    <play @click="playSongEvent.changePlayState" :class="{'play-button-hide':musicEnevt.playState.value}" theme="filled" size="34" fill="#333"/>
                    <pause-one @click="playSongEvent.changePlayState" :class="{'play-button-hide':!musicEnevt.playState.value}" theme="filled" size="34" fill="#333"/>
                    <go-end @click="playMusicStore.nextMusic" theme="filled" size="24" fill="#333"/>
                    <music-list @click.stop="playSongEvent.playQueueOpen.value=!playSongEvent.playQueueOpen.value;playSongEvent.scrollPlaying()" theme="filled" size="24" fill="#333"/>
                    <span @click="musicEnevt.openLyric" class="lyric">词</span>
                </div>
                <div class="play-Volume">
                    <div class="control" @click="playSongEvent.mute">
                        <volume-mute :class="{hide:!playSongEvent.isMute.value}" theme="filled" size="24" fill="#333"/>
                        <volume-small :class="{hide:playSongEvent.isMute.value || playSongEvent.playVolumeVal.value>0.4}" theme="filled" size="24" fill="#333"/>
                        <volume-notice :class="{hide:playSongEvent.isMute.value || playSongEvent.playVolumeVal.value<=0.4}" theme="filled" size="24" fill="#333"/>
                    </div>
                    <!-- 声音调节 -->
                    <input type="range" class="volume-progress" min="0" max="1" step="0.01" :value="playSongEvent.playVolumeVal.value" @input="playSongEvent.changeVolume">
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Up, Minus, Close, MinusTheTop, Square, Play, PauseOne, GoStart, GoEnd, VolumeMute, VolumeSmall, VolumeNotice, MusicList } from '@icon-park/vue-next'
import { inject, watch, ref } from 'vue';
import playMusic from "@/store/modules/playMusic";
import musicbg from '@/assets/imgs/musicbg.png'
import { formatTime, msToSeconds } from '@/common/utils'
import ColorThief from 'colorthief';
import TrafficLight from "@/components/title/TrafficLight.vue";

defineProps(['playInfoShow']);
const emit = defineEmits(['changePlayInfoShow']);
const winEnevt:any = inject('win-enevt');
const musicEnevt:any = inject("music-enevt");
const playSongEvent:any = inject('play-song-event');
let playMusicStore = playMusic();
const img = ref();
const bg = ref();
const colorThief = new ColorThief();

const loadImg = async () => {
    if(img.value.src !== playMusicStore.currPlaySong.img) return;
    const colors = await colorThief.getPalette(img.value, 5);
    // const [c1, c2, c3, c4, c5] = colors.map((e:any) => `rgb(${e[0]}, ${e[1]}, ${e[2]})`);
    const [c1, c2, c3, c4, c5] = colors.map((e:any) => `${e[0]}, ${e[1]}, ${e[2]}`);
    bg.value.style.setProperty('--c1', c1);
    bg.value.style.setProperty('--c2', c2);
    bg.value.style.setProperty('--c3', c3);
    bg.value.style.setProperty('--c4', c4);
    bg.value.style.setProperty('--c5', c5);
}

watch(
    () => playSongEvent.currentTime.value,
    (newVal) => {
        const lyrics = playMusicStore.currPlaySong.lyrics||[];
        const active = document.querySelectorAll('.lyrics ul .active') as unknown as HTMLLIElement[];
        active.forEach((e:HTMLLIElement) => e.classList.remove('active'));
        for (let i = 0; i < lyrics.length; i++) {
            if (msToSeconds(lyrics[i].time) <= newVal && lyrics[i + 1] && msToSeconds(lyrics[i + 1].time) > newVal) {
                const el = document.querySelector(`[data-time='${lyrics[i].time}']`) as HTMLLIElement;
                el.classList.add('active');
                // 调整位置
                const lyricsList = document.querySelector('.lyrics ul') as HTMLElement;
                const scrollTop = -i * el.offsetHeight + 200;
                lyricsList.style.top = `${scrollTop}px`;
                break;
            }
        }
    }, {
        immediate: true
    }
)

const close = () => {
    emit('changePlayInfoShow', false)
}
</script>

<style lang="scss" scoped>
.container-info {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: var(--bg-color);
    // background-image: linear-gradient(135deg, var(--c1), var(--c2), var(--c3), var(--c4), var(--c5));
    left: 0;
    top: -100%;
    border-radius: 10px;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    & {
        background-image: 
                radial-gradient(closest-side, rgba(var(--c1), 1), rgba(var(--c1), 0)),
                radial-gradient(closest-side, rgba(var(--c2), 1), rgba(var(--c2), 0)),
                radial-gradient(closest-side, rgba(var(--c3), 1), rgba(var(--c3), 0)),
                radial-gradient(closest-side, rgba(var(--c4), 1), rgba(var(--c4), 0)),
                radial-gradient(closest-side, rgba(var(--c5), 1), rgba(var(--c5), 0));
            background-size: 
                130vmax 130vmax,
                80vmax 80vmax,
                90vmax 90vmax,
                110vmax 110vmax,
                90vmax 90vmax;
            background-position:
                -80vmax -80vmax,
                60vmax -30vmax,
                10vmax 10vmax,
                -30vmax -10vmax,
                50vmax 50vmax;
            background-repeat: no-repeat;
    }
    &::after {
            content: '';
            display: block;
            position: fixed;
            width: 100%;
            height: 100%;
            top: -100%;
            left: 0;
            backdrop-filter: blur(490px);
            z-index: -1;
    }
    .header {
        height: 50px;
        padding: 0 20px;
        .header-win {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: end;
            > * {
                padding: 3px 5px;
                &:hover {
                    background-color: var(--header-bg-color-hover);
                }
            }
        }
        .header-mac {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: start;
        }
    }
    &.show {
        top: 0;
    }
    &.show::after {
        top: 0;
    }
    > * {
        padding: 0 10px;
    }
    .body {
        flex: 1;
        display: flex;
        align-items: center;
        .info {
            flex: 1;
            margin-left: 10%;
            display: flex;
            flex-direction: column;
            align-items: center;
            > * {
                margin: 5px;
            }
            .name {
                font-size: 22px;
                font-weight: 700;
            }
            .singer, .album {
                cursor: pointer;
                &:hover {
                    color: var(--text-color-hover);
                }
            }
            img {
                width: 140px;
                height: 140px;
                border-radius: 10px;
            }
        }
        .lyrics {
            flex: 2;
            height: calc(100vh - 200px);
            margin-right: 10%;
            overflow-y: scroll;
            text-align: center;
            box-sizing: border-box;
            &::-webkit-scrollbar {
                display: none;
            }
            ul {
                list-style: none;
                padding: 0;
                margin: 0;
                position: relative;
                transition: all 0.3s;
                li {
                    font-size: 18px;
                    line-height: 30px;
                    height: 30px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    &.active {
                        color: var(--text-color-active);
                    }
                }
            }
        }
    }
    .foot {
        height: 70px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .play-progress {
            appearance: none;
            width: 90%;
            height: 3px;
            border-radius: 15px;
            background: -webkit-linear-gradient(var(--progress-left-color), var(--progress-left-color)) no-repeat var(--progress-right-color);
            background-size: 0% 100%;
            cursor: pointer;
            position: relative;
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
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 90%;
            padding: 10px 30px;
            box-sizing: border-box;
            .time {
                font-size: 20px;
                >* {
                    margin: 0 2px;
                }
                .current-time, .total-time{
                    display: inline-block;
                    width: 40px;
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
    }
}
</style>