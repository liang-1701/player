import { eventBus } from "./eventBus";
import { Song } from '@/type/musicTypes';
import { Howl, Howler } from 'howler';

let audio:any = null;

class AudioPlay {

    currSong: Song;
    sound: Howl | undefined;

    constructor(song: Song) {
        this.currSong = song;
    }

    static get(song: Song) {
        if(!audio) {
            audio = new AudioPlay(song)
        }
        return audio;
    }
    
    play() {
        let self = this;
        this.sound = new Howl({
            src: [this.currSong.playUrl||''],
            html5: true,
            loop: false,
            onplay: function() {
                eventBus.emit("audio-play-state", true);
                requestAnimationFrame(self.timeupdate.bind(self))
            },
            onpause: function() {
                eventBus.emit("audio-play-state", false);
            },
            onend: function() {
                eventBus.emit("audio-play-state", false);
                eventBus.emit("audio-play-next");
            },
            onseek: function() {
                requestAnimationFrame(self.timeupdate.bind(self))
            },
            onstop: function() {
                eventBus.emit("audio-play-state", false);
            }
        });
        this.sound.play();
    }

    // 切换播放状态
    togglePlay() {
        if(this.sound) {
            if(this.sound.playing()) {
                this.sound.pause();
            }else {
                this.sound.play();
            }
        }
    }
    
    // 切换歌曲
    toggleSong(song: Song){
        if(this.sound) {
            // 先卸载当前
            this.sound.unload();
            // 加载新的
            this.currSong = song;
            this.play();
        }
    }

    // 停止播放
    stop() {
        if(this.sound) {
            this.sound.stop();
            this.sound.unload();
            this.currSong = {} as Song;
            this.sound = undefined;
            audio = null;
        }
    }

    // 设置播放时间
    seek(percent: number) {
        if(this.sound) {
            if(this.sound.playing()) {
                this.sound.seek(this.sound.duration() * percent);
            }else {
                this.sound.seek(this.sound.duration() * percent);
                this.togglePlay();
            }
        }
    }   

    // timeupdate
    timeupdate() {
        if(this.sound) {
            eventBus.emit("audio-time-update", this.sound.seek());
            if(this.sound.playing()) {
                requestAnimationFrame(this.timeupdate.bind(this))
            }
        }
    }

}

// 播放
export const play = (song: Song) => {
    AudioPlay.get(song).play();
}

// 切换状态
export const togglePlay = () => {
    if(audio) {
        audio.togglePlay();
    }
}

// 切换歌曲
export const toggleSong = (song: Song) => {
    if(audio) {
        audio.toggleSong(song);
    }
}

// 停止播放
export const stop = () => {
    if(audio) {
        audio.stop();
    }
}

eventBus.on("audio-play-volume", (data) => {
    Howler.volume(Number(data));
});

eventBus.on("audio-play-mute", (data) => {
    Howler.mute(Boolean(data))
    
});

eventBus.on("audio-play-change", () => {
    if(audio) {
        audio.togglePlay();
    }
});

eventBus.on("audio-play-seek", (data) => {
    if(audio) {
        audio.seek(data);
    }
});