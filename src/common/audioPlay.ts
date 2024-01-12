import { eventBus } from "./eventBus";
import { music } from '@/type/musicTypes';
import { Howl, Howler } from 'howler';

let audio:any = null;

class AudioPlay {

    currMusic: music;
    sound: Howl | undefined;

    constructor(music: music) {
        this.currMusic = music;
    }

    static get(music: music) {
        if(!audio) {
            audio = new AudioPlay(music)
        }
        return audio;
    }
    
    play() {
        let self = this;
        this.sound = new Howl({
            src: [this.currMusic.playUrl||''],
            html5: true,
            loop: false,
            volume: 0.2,
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
    toggleMusic(music: music){
        if(this.sound) {
            // 先卸载当前
            this.sound.unload();
            // 加载新的
            this.currMusic = music;
            this.play();
        }
    }

    // 停止播放
    stop() {
        if(this.sound) {
            this.sound.stop();
            this.sound.unload();
            this.currMusic = {} as music;
            this.sound = undefined;
            audio = null;
            // eventBus.emit("audio-play-state", false);
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
export const play = (music: music) => {
    AudioPlay.get(music).play();
}

// 切换状态
export const togglePlay = () => {
    audio.togglePlay();
}

// 切换歌曲
export const toggleMusic = (music: music) => {
    audio.toggleMusic(music);
}

// 停止播放
export const stop = () => {
    audio.stop();
}

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