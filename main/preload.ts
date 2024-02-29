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

contextBridge.exposeInMainWorld('api', {
    winClose,
    winMax,
    winMin,
})