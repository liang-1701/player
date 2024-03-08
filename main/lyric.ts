import { BrowserWindow, ipcMain, screen } from "electron";
import path from "path";

let lyricWindow: BrowserWindow | null = null;

ipcMain.on('on-open-lyric-event', (_event, lyricOpen:boolean, playState:boolean, lyric:any) => {
    if (lyricWindow === null) {
        createLyricWindow(playState, lyric);
    }else {
        if (!lyricOpen) {
            lyricWindow?.show();
        }else {
            lyricWindow?.hide();
        }
    }
})

// 关闭歌词面板
ipcMain.on("on-close-lyric-event", () => {
    lyricWindow!.close();
    lyricWindow = null;
})

// 同步主界面的歌词播放状态
ipcMain.on("on-play-state-event", (_event, data: any) => {
    if (lyricWindow && !lyricWindow.isDestroyed()) {
        lyricWindow?.webContents.send("on-play-state-lyric-event", data);
    }
})

// 播放时间同步
ipcMain.on("on-play-time-event", (_event, currTime:any, allTime:any) => {
    if (lyricWindow && !lyricWindow.isDestroyed()) {
        lyricWindow?.webContents.send("on-play-time-lyric-event", currTime, allTime);
    }
})

// 移动窗口位置
ipcMain.on("on-move-lyric-event", (_event, pos) => {
    if (lyricWindow && !lyricWindow.isDestroyed()) {
        if(pos.lockState) { return }
        lyricWindow?.setBounds(
            {
                x: pos.dx,
                y: pos.dy,
                width: winSize.width,
                height: winSize.height
            }
        )
    }
})

// 穿透
ipcMain.on("on-ignore-mouse-event", (_event, lock) => {
    if (lyricWindow && !lyricWindow.isDestroyed()) {
        if(lock) { 
            lyricWindow.setIgnoreMouseEvents(true, {forward:true});
        }else {
             lyricWindow.setIgnoreMouseEvents(false);   
         }
    }
})

const winSize = { width: 1000, height: 100 };

const createLyricWindow = (playState:boolean, lyric:any) => {
    lyricWindow = new BrowserWindow({
        width: winSize.width,
        height: winSize.height,
        x: (screen.getPrimaryDisplay().workAreaSize.width - winSize.width)/2,
        y: screen.getPrimaryDisplay().workAreaSize.height - winSize.height - 50,
        resizable: false,
        frame: false,
        show: false,
        skipTaskbar: true,
        transparent: true,
        hasShadow: false,
        alwaysOnTop: true,
        webPreferences: {
            nodeIntegration: true, // 渲染进程使用Node API
            sandbox: false,  // 开启沙盒则preload脚本被禁用，所以设为false
            preload: path.join(__dirname, "./preload.js"), // 需要引用js文件
            webSecurity: false,
        },
    });
    
    // 如果打包了，渲染index.html
    if (process.env.NODE_ENV !== "development") {
        lyricWindow.loadFile(path.join(__dirname, "./page/lyric.html"));
    } else {
        let url = "http://localhost:3000/page/lyric.html";
        lyricWindow.loadURL(url);
        // devTools独立窗口
        lyricWindow.webContents.openDevTools({mode: 'detach'});
    }
    
    // 页面准备好了再加载
    lyricWindow.on("ready-to-show", () => {
        lyricWindow!.show();
    });

    lyricWindow.webContents.on('did-finish-load', () => {
        lyricWindow!.webContents.send('init-data-lyric-event', playState, lyric);
    });
}
