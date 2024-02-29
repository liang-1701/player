<template>
    <div class="container-lyric" :class="{drag:!lockState}">
        <div class="control">
            <go-start v-show="!lockState" @click="" theme="filled" size="20" fill="#333"/>
            <play-one v-show="!playState&&!lockState" @click=""  theme="filled" size="20" fill="#333"/>
            <pause  v-show="playState&&!lockState" @click="" theme="filled" size="20" fill="#333"/>
            <go-end v-show="!lockState" @click="" theme="filled" size="20" fill="#333"/>
            <span v-show="!lockState" class="split">|</span>
            <home v-show="!lockState" theme="multi-color" size="20" :fill="['#333' ,'#333' ,'#333' ,'#333']"/>
            <lock @click="lockState=false" v-show="lockState" theme="multi-color" size="20" :fill="['#333' ,'#333' ,'#333' ,'#333']"/>
            <unlock @click="lockState=true" v-show="!lockState" theme="multi-color" size="20" :fill="['#333' ,'#333' ,'#333' ,'#333']"/>    
            <Close v-show="!lockState" @click="close" theme="outline" size="20" fill="#333"/>
        </div>
        <div class="lyric-content">
            <span class="txt">{{ currLyric }}</span>
        </div>
    </div>
</template>

<script  lang="ts" setup>
import { PlayOne, Pause, GoStart, GoEnd, Lock, Unlock, Close, Home } from '@icon-park/vue-next'
import { ref } from 'vue';
import { msToSeconds } from '@/common/utils'

const playState = ref(false);
const lyrics = ref<Record<string, any>[]>([]);
const currLyric = ref('暂无歌词');
const lockState = ref(false);


// const togglePlay = () => {
    
// }

window.api.timeFromMain((currTime:any, _allTime:any)=>{
    updateLyric(currTime);
})
const updateLyric = (currTime:number) => {
    for (let i = 0; i < lyrics.value.length; i++) {
        if (lyrics.value.length === 1) {
            currLyric.value = lyrics.value[0].txt;
        }
        if (msToSeconds(lyrics.value[i].time) <= currTime && lyrics.value[i + 1] && msToSeconds(lyrics.value[i + 1].time) > currTime) {
            currLyric.value = lyrics.value[i].txt;
            break;
        }
    }
}

window.api.playStateFromMain((data:any)=>{
    playState.value = !playState.value;
    lyrics.value = data;
    if (data.length == 0) {
        lyrics.value = [{time:'00:00',txt:'暂无歌词'}];
        updateLyric(0);
    }
})

const close = () => {
    window.api.closeLyric();
}

window.api.initDataFromMain((state:boolean, lyric:any) =>{
    playState.value = state;
    lyrics.value = lyric;
})
</script>

<style lang="scss" scoped>
.container-lyric {
    width: 100%;
    height: 100vh;
    .control {
        margin-top: 5px;
        text-align: center;
        > * {
            -webkit-app-region: no-drag;
            margin: 0 5px;
            cursor: pointer;
            &:hover :deep(svg > *) {
                fill: var(--icon-color-hover);
                stroke: var(--icon-color-hover);
            }
        }
        .split {
            color: #333;
            font-size: 20px;
            margin: 0 30px;
            opacity: 0.5;
        }
        
    }
    .lyric-content {
        text-align: center;
        margin-top: 15px;
        font-size: 30px;
    }
}
</style>