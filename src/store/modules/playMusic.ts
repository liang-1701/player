import { defineStore } from "pinia";
import { Song } from "@/type/musicTypes";
import { play, toggleSong, togglePlay, stop } from "@/common/audioPlay";
import musicResource from "@/store/modules/musicResource";
import { getClassName } from "@/common/importModule";

let musicStore = musicResource();

let playStore = defineStore("play", {
    state: () => {
        return {
            currPlaySong: {} as Song,  // 当前播放歌曲
            playQueue: [] as Song[],  // 播放队列
        };
    },
    actions: {
        // 在播放队列最后添加单首歌曲
        addSong(song: Song) {
            if (!this.playQueue.includes(song)) {
                this.playQueue.push(song);
            }
        },
        // 在播放队列最后添加多首歌曲
        addSongList(songs: any) {
            songs.forEach((song:any) => this.addSong(song));
        },
        // 删除播放队列中的某首歌曲
        removeSong(song: Song) {
            if (this.playQueue.includes(song)) {
                this.playQueue.splice(this.playQueue.indexOf(song), 1);
            }
            if (this.currPlaySong === song) {
                this.currPlaySong = {} as Song;
                stop();
            }
        },
        clearQueue() {
            if(this.currPlaySong && Object.keys(this.currPlaySong).length !== 0) {
                stop();
            }
            this.playQueue = [];
            this.currPlaySong = {} as Song;
        },
        // 清空当前列表并添加多个
        clearAndAdd(songs: Song[]) {
            this.clearQueue();
            this.addSongList(songs);
        },
        async getSongDetail(song: Song) {
            this.currPlaySong = song;
            if (song.playUrl) { return }
            const plat = musicStore.menus!.meta.platform!.find((item:any) => item.id == song.chl);
            const method = await getClassName(plat!.file, "getSongDetail");
            const result = await method!(song);
            this.currPlaySong.playUrl = result.playUrl;
        },
        async play(song: Song) {
            if(!this.currPlaySong.id) {
                this.addSong(song);
                await this.getSongDetail(song);
                play(this.currPlaySong);
            }else if(this.currPlaySong.id == song.id){
                togglePlay();
            }else {
                this.addSong(song);
                await this.getSongDetail(song);
                // 切换歌曲
                toggleSong(this.currPlaySong);
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
