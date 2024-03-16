import { BrowserWindow, ipcMain, screen } from "electron";
import path from "path";

let microWindow: BrowserWindow | null = null;
let closeState: boolean = false;

ipcMain.on('openMicroToMicro', (_event, playState:boolean, data:any) => {
    if (microWindow === null) {
        closeState = false;
        createMicroWindow(playState, data);
    }else {
        if (microWindow.isVisible()) {
            microWindow?.hide();
        }else {
            microWindow?.show();
        }
    }
})

// 同步主界面的播放状态
ipcMain.on("sendPlayStateToMicro", (_event, data: boolean) => {
    if (microWindow && !microWindow.isDestroyed()) {
        microWindow?.webContents.send("sendPlayStateFromLyric", data);
    }
})
// 同步主界面的歌曲信息
ipcMain.on("sendSongToMicro", (_event, data: any) => {
    if (microWindow && !microWindow.isDestroyed()) {
        microWindow?.webContents.send("sendSongFromLyric", data);
    }
})

// 播放时间同步
ipcMain.on("timeUpdateToMicro", (_event, currTime:any, allTime:any) => {
    if (microWindow && !microWindow.isDestroyed()) {
        microWindow?.webContents.send("timeUpdateFromMicro", currTime, allTime);
    }
})
// 获取播放列表
ipcMain.on("sendPlayListToMicro", (_event, data:any) => {
    if (microWindow && !microWindow.isDestroyed()) {
        microWindow?.webContents.send("sendPlayListFromMicro", data);
    }
})

// 关闭
ipcMain.on("closeMicroToMicro", () => {
    closeState = true;
    if (microWindow && !microWindow.isDestroyed()) {
        microWindow!.close();
    }
})

// 穿透
ipcMain.on("setIgnoreMouseEventsToMicro", (_event, lock) => {
    if (microWindow && !microWindow.isDestroyed()) {
        if(lock) { 
            microWindow.setIgnoreMouseEvents(true, {forward:true});
        }else {
            microWindow.setIgnoreMouseEvents(false);   
         }
    }
})

// 移动窗口位置
ipcMain.on("moveMicroToMicro", (_event, pos) => {
    if (microWindow && !microWindow.isDestroyed()) {
        microWindow?.setBounds(
            {
                x: pos.dx,
                y: pos.dy,
                width: winSize.width,
                height: winSize.height
            }
        )
    }
})

const winSize = { width: 300, height: 400 };

const createMicroWindow = (playState:boolean, data:any) => {
    microWindow = new BrowserWindow({
        width: winSize.width,
        height: winSize.height,
        x: screen.getPrimaryDisplay().workAreaSize.width - winSize.width - 50,
        y: 150,
        resizable: false,
        frame: false,
        transparent: true,
        show: false,
        skipTaskbar: true,
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
        microWindow.loadFile(path.join(__dirname, "./page/micro.html"));
    } else {
        let url = "http://localhost:3000/page/micro.html";
        microWindow.loadURL(url);
        // devTools独立窗口
        microWindow.webContents.openDevTools({mode: 'detach'});
    }
    
    // 页面准备好了再加载
    microWindow.on("ready-to-show", () => {
        microWindow!.show();
    });

    microWindow.webContents.on('did-finish-load', () => {
        microWindow!.webContents.send('initDataToMicro', playState, data);
    });

    microWindow!.on("close", (event) => {
        if(!closeState) {
            event.preventDefault(); // 阻止窗口关闭
        }
    });
    
    microWindow!.on("closed", () => {
        microWindow = null;
    });
}
