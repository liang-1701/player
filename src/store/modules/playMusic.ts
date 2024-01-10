import { defineStore } from "pinia";
import { music } from "@/type/musicTypes";
import { getSongDetail } from '@/platform/qq'

let playStore = defineStore("play", {
    state: () => {
        return {
            playState: false,  // 播放状态
            currPlayMusic: {} as music,  // 当前播放歌曲
            playQueue: [] as music[],  // 播放队列
        };
    },
    actions: {
        // 在播放队列最后添加单首歌曲
        addMusic(music: music) {
            if (!this.playQueue.includes(music)) {
                music.index = this.playQueue.length;
                this.playQueue.push(music);
            }
        },
        // 在播放队列最后添加多首歌曲
        addMusicList(musicList: music[]) {
            musicList.forEach((item, index) => { item.index = this.playQueue.length + index;});
            this.playQueue.push(...musicList);
        },
        // 清空当前列表并添加多个
        clearAndAdd(musicList: music[]) {
            this.playQueue = [];
            this.playQueue = musicList;
            this.playQueue.forEach((item, index) => {
                item.index = index;
            })
        },
        getSongDetail(music: music) {
            this.currPlayMusic = music;
            getSongDetail(music).then(res => {
                this.currPlayMusic.playUrl = res.playUrl;
            })
        }
    },
    getters: {

    }
});

export default playStore;
