import { Sync } from "@icon-park/vue-next";
import { contextBridge, ipcRenderer } from "electron";

// 去除安全警告
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true"

/******************** 渲染进程(*.vue)-------→主进程(*.ts) *********************/
/**----------- main.ts ------------- */
const winClose = () => {
    ipcRenderer.send('closeMainToMain');
}
const winMax = (value: any) => {
    ipcRenderer.send('maxMainToMain', value);
}
const winMin = () => {
    ipcRenderer.send('minMainToMain');
}
// 下一首
const nextSong = () => {
    ipcRenderer.send('nextSongToMain');
}
// 上一首
const prevSong = () => {
    ipcRenderer.send('prevSongToMain');
}
// 改变播放状态
const togglePlayState = () => {
    ipcRenderer.send('togglePlayStateToMain');
}
// 显示主界面
const showMainWindow = () => {
    ipcRenderer.send('showMainWindowToMain');
}
// 关闭子窗口
ipcRenderer.on('closeAllWindows', () => {
    ipcRenderer.send('closeLyricToLyric');
    ipcRenderer.send('closeMicroToMicro');
})
/**----------- lyric.ts ------------- */
// 打开歌词面板
const openLyric = (lyricOpen:boolean, playState:boolean, song:any) => {
    ipcRenderer.send('openLyricToLyric', lyricOpen, playState, song);
}
// 歌词面板关闭
const closeLyric = () => {
    ipcRenderer.send('closeLyricToLyric');
    ipcRenderer.send('changeLyricStateToMain');
}
// 播放时间同步
const timeUpdate = (currTime:any, allTime:any) => {
    ipcRenderer.send('timeUpdateToLyric', currTime, allTime);
    ipcRenderer.send('timeUpdateToMicro', currTime, allTime);
}
// 移动歌词面板窗口
const moveLyric = (pos:any) => {
    ipcRenderer.send('moveLyricToLyric', pos);
}
// 歌词面板穿透
const setIgnoreMouseEventsToLyric = (lock:boolean) => {
    ipcRenderer.send('setIgnoreMouseEventsToLyric', lock);
}
// 播放状态同步
const sendPlayState = (data:boolean) => {
    ipcRenderer.send('sendPlayStateToLyric', data);
    ipcRenderer.send('sendPlayStateToMicro', data);
}
// 歌曲信息同步
const sendSong = (data:any) => {
    ipcRenderer.send('sendSongToLyric', data);
    ipcRenderer.send('sendSongToMicro', data);
}
/**----------- micro.ts ------------- */
// 打开小窗口播放
const openMicro = (playState:boolean, data:any) => {
    ipcRenderer.send('openMicroToMicro', playState, data);
}
// 移动小窗口
const moveMicro = (pos:any) => {
    ipcRenderer.send('moveMicroToMicro', pos);
}
// 小窗口穿透
const setIgnoreMouseEventsToMicro = (lock:boolean) => {
    ipcRenderer.send('setIgnoreMouseEventsToMicro', lock);
}
// 小窗口关闭
const closeMicro = () => {
    ipcRenderer.send('closeMicroToMicro');
}
// 获取播放列表
const sendPlayList = (data:any) => {
    ipcRenderer.send('sendPlayListToMicro', data);
}

/******************** 主进程(main.ts)-------→渲染进程(app.vue) *********************/
const getPlatform = (callback: (platform:any) => void) => {
    ipcRenderer.on('getPlatform', (_event, platform:any) => {
        callback(platform);
    })
}
// 同步歌词面板状态
const changeLyricStateFromMain = (callback: () => void) => {
    ipcRenderer.on('changeLyricStateFromMain', () => {
        callback();
    })
}
// 下一首
const nextSongFromMain = (callback: () => void) => {
    ipcRenderer.on('nextSongFromMain', () => {
        callback();
    })
}
// 上一首
const prevSongFromMain = (callback: () => void) => {
    ipcRenderer.on('prevSongFromMain', () => {
        callback();
    })
}
// 改变播放状态
const togglePlayStateFromMain = (callback: () => void) => {
    ipcRenderer.on('togglePlayStateFromMain', () => {
        callback();
    })
}

/******************** 主进程(lyric.ts)-------→渲染进程(lyric.vue) *********************/
// 初始化数据到歌词面板
const initDataFromLyric = (callback: (playState:boolean, song:any) => void) => {
    ipcRenderer.on('initDataFromLyric', (_event, playState:boolean, song:any) => {
        callback(playState, song);
    })
}
// 同步播放状态到歌词面板
const sendPlayStateFromLyric = (callback: (data:boolean) => void) => {
    ipcRenderer.on('sendPlayStateFromLyric', (_event, data: boolean) => {
        callback(data);
    })
}
// 同步歌曲信息到歌词面板
const sendSongFromLyric = (callback: (data:any) => void) => {
    ipcRenderer.on('sendSongFromLyric', (_event, data: any) => {
        callback(data);
    })
}
// 播放时间同步
const timeUpdateFromLyric = (callback: (currTime:any, allTime:any) => void) => {
    ipcRenderer.on('timeUpdateFromLyric', (_event, currTime:any, allTime:any) => {
        callback(currTime, allTime);
    })
}

/******************** 主进程(micro.ts)-------→渲染进程(micro.vue) *********************/
// 初始化数据
const initDataToMicro = (callback: (dplayState:boolean, data:any) => void) => {
    ipcRenderer.on('initDataToMicro', (_event, playState:boolean, data:any) => {
        callback(playState, data);
    })
}
// 播放时间同步
const timeUpdateFromMicro = (callback: (currTime:any, allTime:any) => void) => {
    ipcRenderer.on('timeUpdateFromMicro', (_event, currTime:any, allTime:any) => {
        callback(currTime, allTime);
    })
}
// 同步播放状态到歌词面板
const sendPlayStateFromMicro = (callback: (data:boolean) => void) => {
    ipcRenderer.on('sendPlayStateFromLyric', (_event, data: boolean) => {
        callback(data);
    })
}
// 同步歌曲信息到歌词面板
const sendSongFromMicro = (callback: (data:any) => void) => {
    ipcRenderer.on('sendSongFromLyric', (_event, data: any) => {
        callback(data);
    })
}            
// 同步播放列表
const sendPlayListFromMicro = (callback: (data:any) => void) => {
    ipcRenderer.on('sendPlayListFromMicro', (_event, data: any) => {
        callback(data);
    })
}            

contextBridge.exposeInMainWorld('api', {
    winClose,
    winMax,
    winMin,
    nextSong,
    prevSong,
    togglePlayState,
    showMainWindow,
    openLyric,
    closeLyric,
    timeUpdate,
    moveLyric,
    setIgnoreMouseEventsToLyric,
    sendPlayState,
    sendSong,
    getPlatform,
    changeLyricStateFromMain,
    nextSongFromMain,
    prevSongFromMain,
    togglePlayStateFromMain,
    initDataFromLyric,
    sendPlayStateFromLyric,
    sendSongFromLyric,
    timeUpdateFromLyric,
    openMicro,
    initDataToMicro,
    moveMicro,
    setIgnoreMouseEventsToMicro,
    closeMicro,
    timeUpdateFromMicro,
    sendPlayStateFromMicro,
    sendSongFromMicro,
    sendPlayList,
    sendPlayListFromMicro
})