<template>
    <div class="control">
        <go-start v-show="!lockState" @click="prevSong" theme="filled" size="20" fill="#333"/>
        <play-one v-show="!playState&&!lockState" @click="togglePlayState"  theme="filled" size="20" fill="#333"/>
        <pause  v-show="playState&&!lockState" @click="togglePlayState" theme="filled" size="20" fill="#333"/>
        <go-end v-show="!lockState" @click="nextSong" theme="filled" size="20" fill="#333"/>
        <span v-show="!lockState" class="split">|</span>
        <home @click="showMainWindow" v-show="!lockState" theme="multi-color" size="20" :fill="['#333' ,'#333' ,'#333' ,'#333']"/>
        <lock id="lock" @click="lockState=false;" v-show="lockState" theme="multi-color" size="20" :fill="['#333' ,'#333' ,'#333' ,'#333']"/>
        <unlock @click="lockState=true;" v-show="!lockState" theme="multi-color" size="20" :fill="['#333' ,'#333' ,'#333' ,'#333']"/>    
        <Close v-show="!lockState" @click="close" theme="outline" size="20" fill="#333"/>
    </div>
    <div class="lyric-content">
        <span class="txt">{{ currLyric }}</span>
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

const nextSong = () => {
    window.api.nextSong();
}
const prevSong = () => {
    window.api.prevSong();
}
const togglePlayState = () => {
    window.api.togglePlayState();
}

window.api.timeUpdateFromLyric((currTime:any, _allTime:any)=>{
    updateLyric(currTime);
})

const showMainWindow = () => {
    window.api.showMainWindow();
}

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

window.api.sendPlayStateFromLyric((data:boolean) => {
    playState.value = data;

})

window.api.sendSongFromLyric((data:any)=>{
    lyrics.value = data.lyrics;
    if (lyrics.value.length == 0) {
        lyrics.value = [{time:'00:00',txt:'暂无歌词'}];
        updateLyric(0);
    }
})

document.addEventListener('mouseover', (event:MouseEvent) => {
    const lockEl = document.querySelector('#lock') as HTMLElement;
    if(lockEl.contains(event.target as HTMLElement)) {
        window.api.setIgnoreMouseEventsToLyric(false);
    }else {
        window.api.setIgnoreMouseEventsToLyric(lockState.value);
    }
    if(!lockState.value) {
        document.querySelector('#lyric')?.classList.add('unlock');
    }else {
        document.querySelector('#lyric')?.classList.remove('unlock');
    }
})

document.addEventListener('mousedown', (event: MouseEvent) => {
    const initPos = {x: event.x, y: event.y};
    const move = (event: MouseEvent) => {
        const dx = event.screenX - initPos.x;
        const dy = event.screenY - initPos.y;
        window.api.moveLyric({dx, dy, lockState: lockState.value})
    }
    
    document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', move);
    });
    document.addEventListener('mousemove', move);
});


const close = () => {
    window.api.closeLyric();
}

window.api.initDataFromLyric((state:boolean, data:any) =>{
    playState.value = state;
    lyrics.value = data.lyrics;
})
</script>

<style lang="scss" scoped>
.control {
    text-align: center;
    > * {
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
    font-size: 30px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>