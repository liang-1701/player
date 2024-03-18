import { app, BrowserWindow, ipcMain, session, Menu, nativeImage, dialog } from "electron";
import path from "path";
import windowStateKeeper from "electron-window-state";
import electronDevtoolsInstaller, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import "./lyric";
import "./micro";
import { createTyay, tray, flag } from "./tary";

let win: BrowserWindow | null = null;
let icon = nativeImage.createFromPath(path.join(__dirname, '/tary.png'));
let dialogClose = {
    isClose: false,  // 是否关闭
}

const createWindow = () => {
    const winState = windowStateKeeper({
        defaultWidth: 1020,
        defaultHeight: 630,
    })

    win = new BrowserWindow({
        width: winState.width,
        height: winState.height,
        minWidth: 1040,
        minHeight: 630,
        x: winState.x,
        y: winState.y,
        show: false,
        frame: false,
        transparent: true,
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 50, y: 20 },
        hasShadow: false,
        icon: icon,
        modal: true,
        webPreferences: {
            // contextIsolation: false, // 是否开启隔离上下文
            nodeIntegration: true, // 渲染进程使用Node API
            sandbox: false,  // 开启沙盒则preload脚本被禁用，所以设为false
            preload: path.join(__dirname, "./preload.js"), // 需要引用js文件
            webSecurity: false
        },
    });

    // 如果打包了，渲染index.html
    if (process.env.NODE_ENV !== "development") {
        win.loadFile(path.join(__dirname, "./index.html"));
    } else {
        let url = "http://localhost:3000";
        win.loadURL(url);
        // devTools独立窗口
        win.webContents.openDevTools({mode: 'detach'});
        // // 加载vuejs-devtools插件
        // electronDevtoolsInstaller(VUEJS_DEVTOOLS);
    }

    // 页面准备好了再加载
    win.on("ready-to-show", () => {
        win!.webContents.send('getPlatform', process.platform);
        win!.show();
    });

    win.on("close", async (event) => {
        if(flag) {
            dialogClose.isClose = true;
        }
        if(!dialogClose.isClose) {
            event.preventDefault();
            win!.webContents.send('quitAskFromMain');
        }else {
            win!.webContents.send('closeAllWindows');
            tray.destroy();
        }
    });
    
    win.on("closed", () => {
        // const allWindows = BrowserWindow.getAllWindows();
        // allWindows.every((window) => window.close())
    });

    // 全局设置应用程序图标（仅 macOS）
    if (process.platform === 'darwin') {
        app.dock.setIcon(icon);
    }
    // 托盘图标
    createTyay(app, win);

    ipcMain.on("closeMainToMain", () => {
        dialogClose.isClose = true;
        win!.close();
        // app.quit();
    })
    let winsSize = win.getSize();
    let winsPosition = win.getPosition();
    ipcMain.on("maxMainToMain", (_event, res) => {
        if (!res.winMax) {
            winsSize = win!.getSize();
            winsPosition = win!.getPosition();
            win!.maximize();
        }else {
            win!.unmaximize();
            win!.setBounds(
                {
                    x: winsPosition[0],
                    y: winsPosition[1],
                    width: winsSize[0],
                    height: winsSize[1]
                }
            )
        }
    })
    ipcMain.on("minMainToMain", () => {
        win!.minimize();
    })
    ipcMain.on("changeLyricStateToMain", () => {
        win?.webContents.send("changeLyricStateFromMain");
    })

    ipcMain.on("nextSongToMain", () => {
        win?.webContents.send("nextSongFromMain");
    })
    ipcMain.on("prevSongToMain", () => {
        win?.webContents.send("prevSongFromMain");
    })
    ipcMain.on("togglePlayStateToMain", () => {
        win?.webContents.send("togglePlayStateFromMain");
    })
    ipcMain.on("showMainWindowToMain", () => {
        win?.show();
    })
    ipcMain.on("hideMainWindowToMain", () => {
        win?.hide();
    })
    ipcMain.on("playSongToMain", (_event, data) => {
        win?.webContents.send("playSongFromMain", data);
    })

    // 修改referer
    session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        const { requestHeaders } = overrideRequest(details)
        callback({ requestHeaders })
    });

};

const overrideRequest = (details: Electron.OnBeforeSendHeadersListenerDetails) => {
    const { url } = details;
    if (url.includes('localhost')) {
        return details
    }
    let origin = null, referer = null, xrouter = null
    let cookie = null, userAgent = null
    let csrf = null, cross = null, secret = null
    if(url.includes("qq.com")) {
        origin = "https://y.qq.com/";
        if(url.includes('moviets.tc.qq.com')) {
            origin = "https://v.qq.com/"
        }
        referer = origin
    }else if (url.includes("163.com") || url.includes("126.net")) {
        origin = "https://music.163.com/"
        if (url.includes("/cloudsearch/")) {
            referer = 'https://music.163.com/search/'
        }
        if (!referer) referer = origin
    } else if (url.includes("kugou")) {
        origin = "https://www.kugou.com/"
        referer = origin
        if (url.includes("&cmd=123&ext=mp4&hash=")) xrouter = 'trackermv.kugou.com'
    }
    //默认Referer
    if (!referer || referer.includes('localhost')) {
        if (!url.includes('localhost')) {
            const urlParts = url.split('://')
            const scheme = urlParts[0]
            const host = urlParts[1].split('/')[0]
            referer = `${scheme}://${host}/`
        }
    }
    if (origin) details.requestHeaders['Origin'] = origin
    if (userAgent) details.requestHeaders['User-Agent'] = userAgent
    if (referer) details.requestHeaders['Referer'] = referer
    if (cookie) details.requestHeaders['Cookie'] = cookie
    if (xrouter) details.requestHeaders['x-router'] = xrouter
    if (csrf) details.requestHeaders['CSRF'] = csrf
    if (cross) details.requestHeaders['Cross'] = cross
    if (secret) details.requestHeaders['Secret'] = secret
    return details
}

// Electron会在初始化完成并且准备好创建浏览器窗口时调用这个方法
app.on("ready", () => {
    const gotTheLock = app.requestSingleInstanceLock();
    if (!gotTheLock) {
        app.quit();
    }else {
        app.on('second-instance', (_event, _commandLine, _workingDirectory) => {
            // 唤醒已存在的窗口
            if (win) {
                if (win.isMinimized()) win.restore();
                win.focus();
            }
        });
        const mainMenu = Menu.buildFromTemplate([]);
        Menu.setApplicationMenu(mainMenu);
        createWindow();
    }
});

//当所有窗口都被关闭后退出
app.on("window-all-closed", () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
