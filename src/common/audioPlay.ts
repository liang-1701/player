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
        console.log("play");
        console.log(this.currMusic);
        this.sound = new Howl({
            src: [this.currMusic.playUrl||''],
            html5: true,
            loop: false,
            volume: 0.2,
            onplay: function() {
                console.log("play之后");
                eventBus.emit("audio-play-state", true);
            },
            onpause: function() {
                console.log("pause之后");
                eventBus.emit("audio-play-state", false);
            },
            onend: function() {
                console.log("end之后");
                eventBus.emit("audio-play-state", false);
            },
            onseek: function() {
                console.log("seek之后");
            }
        });
        this.sound.play();
    }

    // 切换播放状态
    togglePlay() {
        console.log("togglePlay");
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

}

// 播放
export const play = (music: music) => {
    console.log("播放");
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

eventBus.on("audio-play-change", () => {
    if(audio) {
        audio.togglePlay();
    }
});