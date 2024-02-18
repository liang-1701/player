import { defineStore } from "pinia";
import { Song } from "@/type/musicTypes";
import { play, toggleMusic, togglePlay, stop } from "@/common/audioPlay";
import musicResource from "@/store/modules/musicResource";
import { getClassName } from "@/common/importModule";

let musicStore = musicResource();

let playStore = defineStore("play", {
    state: () => {
        return {
            playState: false,  // 播放状态
            currPlaySong: {} as Song,  // 当前播放歌曲
            playQueue: [] as Song[],  // 播放队列
        };
    },
    actions: {
        // 在播放队列最后添加单首歌曲
        addMusic(music: Song) {
            if (!this.playQueue.includes(music)) {
                this.playQueue.push(music);
            }
        },
        // 在播放队列最后添加多首歌曲
        addMusicList(musicList: Song[]) {
            this.playQueue.push(...musicList);
        },
        // 删除播放队列中的某首歌曲
        removeMusic(music: Song) {
            if (this.playQueue.includes(music)) {
                this.playQueue.splice(this.playQueue.indexOf(music), 1);
            }
            if (this.currPlaySong === music) {
                stop();
                this.currPlaySong = {} as Song;
            }
        },
        clearQueue() {
            if(this.currPlaySong) {
                stop();
            }
            this.playQueue = [];
            this.currPlaySong = {} as Song;
        },
        // 清空当前列表并添加多个
        clearAndAdd(musicList: Song[]) {
            this.playQueue = [];
            this.playQueue = musicList;
        },
        async getSongDetail(music: Song) {
            this.currPlaySong = music;
            if (music.playUrl) { return }
            const plat = musicStore.menus!.meta.platform!.find((item:any) => item.id == music.data?.chl);
            const method = await getClassName(plat!.file, "getSongDetail");
            const result = await method!(music);
            this.currPlaySong.playUrl = result.playUrl;
        },
        async play(song: Song) {
            if(!this.currPlaySong.id) {
                this.addMusic(song);
                await this.getSongDetail(song);
                play(this.currPlaySong);
            }else if(this.currPlaySong.id == song.id){
                togglePlay();
            }else {
                this.addMusic(song);
                await this.getSongDetail(song);
                // 切换歌曲
                toggleMusic(this.currPlaySong);
            }
        },
        // 上一首
        prevMuisc(){
            let index = this.playQueue.findIndex(item => item.id == this.currPlaySong.id);
            if(--index >= 0) {
                this.play(this.playQueue[index]);
            }
            if(index < 0) {
                this.play(this.playQueue[this.playQueue.length - 1]);
            }
        },
        // 下一首
        nextMuisc() {
            let index = this.playQueue.findIndex(item => item.id == this.currPlaySong.id);
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
