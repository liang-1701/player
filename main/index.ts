import { app, BrowserWindow, ipcMain, session } from "electron";
import path from "path";
import windowStateKeeper from "electron-window-state";
import electronDevtoolsInstaller, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import "./lyric";

const createWindow = () => {
    const winState = windowStateKeeper({
        defaultWidth: 1020,
        defaultHeight: 630,
    })

    let win: BrowserWindow | null = null;
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
        hasShadow: false,
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
        win!.show();
    });

    win.webContents.on('did-finish-load', () => {
        win!.webContents.send('platform-event', process.platform);
    });

    win.on("closed", () => {
        win = null
    });

    ipcMain.on("on-close-custom-event", () => {
        win!.webContents.removeAllListeners();
        win!.close();
        app.quit();
    })
    let winsSize = win.getSize();
    let winsPosition = win.getPosition();
    ipcMain.on("on-max-custom-event", (_event, res) => {
        if (!res.winMax) {
            winsSize = win!.getSize();
            winsPosition = win!.getPosition();
            win!.maximize();
        }else {
            win!.setSize(winsSize[0], winsSize[1])
            win!.setPosition(winsPosition[0], winsPosition[1])
        }
    })
    ipcMain.on("on-min-custom-event", () => {
        win!.minimize();
    })

    ipcMain.on("on-close-lyric-win-event", () => {
        win?.webContents.send("on-change-lyric-event");
    })

    ipcMain.on("on-next-Song-event", () => {
        win?.webContents.send("on-next-Song-main-event");
    })
    ipcMain.on("on-prev-Song-event", () => {
        win?.webContents.send("on-prev-Song-main-event");
    })
    ipcMain.on("on-change-play-state-event", () => {
        win?.webContents.send("on-change-play-state-main-event");
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
    createWindow();
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
