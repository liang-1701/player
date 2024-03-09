import { contextBridge, ipcRenderer } from "electron";

// 去除安全警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"

const winClose = () => {
    ipcRenderer.send('on-close-custom-event');
}
const winMax = (value: any) => {
    ipcRenderer.send('on-max-custom-event', value);
}
const winMin = () => {
    ipcRenderer.send('on-min-custom-event');
}
const getPlatform = (callback: (platform:any) => void) => {
    ipcRenderer.on('platform-event', (_event, platform:any) => {
        callback(platform);
    })
}

// 打开歌词面板
const openLyric = (lyricOpen:boolean, playState:boolean, lyric:any) => {
    ipcRenderer.send('on-open-lyric-event', lyricOpen, playState, lyric);
}
const initDataFromMain = (callback: (playState:boolean, lyric:any) => void) => {
    ipcRenderer.on('init-data-lyric-event', (_event, playState:boolean, lyric:any) => {
        callback(playState, lyric);
    })
}

ipcRenderer.on('on-close-lyric-from-main-event', () => {
    ipcRenderer.send('on-close-lyric-event');
})

// 歌词面板关闭
const closeLyric = () => {
    ipcRenderer.send('on-close-lyric-event');
    ipcRenderer.send('on-close-lyric-win-event');
}
const changeLyricState = (callback: () => void) => {
    ipcRenderer.on('on-change-lyric-event', () => {
        callback();
    })
}

// 播放状态和歌词同步到歌词面板
const playStatetoLyric = (data:any) => {
    ipcRenderer.send('on-play-state-event', data);
}
const playStateFromMain = (callback: (data:any) => void) => {
    ipcRenderer.on('on-play-state-lyric-event', (_event, data: any) => {
        callback(data);
    })
}

// 播放时间同步
const timetoLyric = (currTime:any, allTime:any) => {
    ipcRenderer.send('on-play-time-event', currTime, allTime);
}
const timeFromMain = (callback: (currTime:any, allTime:any) => void) => {
    ipcRenderer.on('on-play-time-lyric-event', (_event, currTime:any, allTime:any) => {
        callback(currTime, allTime);
    })
}

// 移动窗口
const moveLyric = (pos:any) => {
    ipcRenderer.send('on-move-lyric-event', pos);
}

// 下一首
const nextSongToMain = (currTime:any, allTime:any) => {
    ipcRenderer.send('on-next-Song-event', currTime, allTime);
}
const nextSongFromLyric = (callback: () => void) => {
    ipcRenderer.on('on-next-Song-main-event', () => {
        callback();
    })
}
// 上一首
const prevSongToMain = (currTime:any, allTime:any) => {
    ipcRenderer.send('on-prev-Song-event', currTime, allTime);
}
const prevSongFromLyric = (callback: () => void) => {
    ipcRenderer.on('on-prev-Song-main-event', () => {
        callback();
    })
}
// 上一首
const changePlayStateToMain = (currTime:any, allTime:any) => {
    ipcRenderer.send('on-change-play-state-event', currTime, allTime);
}
const changePlayStateFromLyric = (callback: () => void) => {
    ipcRenderer.on('on-change-play-state-main-event', () => {
        callback();
    })
}

const setIgnoreMouseEvents = (lock:boolean) => {
    ipcRenderer.send('on-ignore-mouse-event', lock);
}

const showMainWindow = () => {
    ipcRenderer.send('on-show-win-event');
}

contextBridge.exposeInMainWorld('api', {
    winClose,
    winMax,
    winMin,
    getPlatform,
    openLyric,
    initDataFromMain,
    closeLyric,
    changeLyricState,
    playStatetoLyric,
    playStateFromMain,
    timetoLyric,
    timeFromMain,
    moveLyric,
    nextSongToMain,
    nextSongFromLyric,
    prevSongToMain,
    prevSongFromLyric,
    changePlayStateToMain,
    changePlayStateFromLyric,
    setIgnoreMouseEvents,
    showMainWindow
})