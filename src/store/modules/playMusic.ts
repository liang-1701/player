import { defineStore } from "pinia";
import { music } from "@/type/musicTypes";
import { play, toggleMusic, togglePlay, stop } from "@/common/audioPlay";
import musicResource from "@/store/modules/musicResource";
import { importAndExtract } from "@/common/importModule";

let musicStore = musicResource();

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
        // 删除播放队列中的某首歌曲
        removeMusic(music: music) {
            if (this.playQueue.includes(music)) {
                this.playQueue.splice(this.playQueue.indexOf(music), 1);
            }
            if (this.currPlayMusic === music) {
                stop();
                this.currPlayMusic = {} as music;
            }
        },
        clearQueue() {
            if(this.currPlayMusic) {
                stop();
            }
            this.playQueue = [];
            this.currPlayMusic = {} as music;
        },
        // 清空当前列表并添加多个
        clearAndAdd(musicList: music[]) {
            this.playQueue = [];
            this.playQueue = musicList;
            this.playQueue.forEach((item, index) => {
                item.index = index;
            })
        },
        async getSongDetail(music: music) {
            this.currPlayMusic = music;
            if (music.playUrl) { return }
            const plat = musicStore.menus!.meta.platform!.find((item:any) => item.id == music.data?.chl);
            const method = await importAndExtract(`/src/platform/${plat?.file}`, 'getSongDetail');
            const result = await method(music);
            this.currPlayMusic.playUrl = result.playUrl;
        },
        async play(music: music) {
            if(!this.currPlayMusic.mid) {
                this.addMusic(music);
                await this.getSongDetail(music);
                play(this.currPlayMusic);
            }else if(this.currPlayMusic.mid == music.mid){
                togglePlay();
            }else {
                this.addMusic(music);
                await this.getSongDetail(music);
                // 切换歌曲
                toggleMusic(this.currPlayMusic);
            }
        },
        // 上一首
        prevMuisc(){
            let index = this.playQueue.findIndex(item => item.mid == this.currPlayMusic.mid);
            if(--index >= 0) {
                this.play(this.playQueue[index]);
            }
            if(index < 0) {
                this.play(this.playQueue[this.playQueue.length - 1]);
            }
        },
        // 下一首
        nextMuisc() {
            let index = this.playQueue.findIndex(item => item.mid == this.currPlayMusic.mid);
            if(++index < this.playQueue.length) {
                this.play(this.playQueue[index]);
            }
            if(index == this.playQueue.length) {
                this.play(this.playQueue[0]);
            }
        },
    },
    getters: {

    }
});

export default playStore;
