import { Tray, Menu } from 'electron'
import path from 'path'

export const createTyay = (app:any, win:any) => {
    const tray = new Tray(path.join(__dirname, 
        // process.platform == 'darwin'? '/taryTemplate@2x.png' : '/tary.png'));  // mac模板适应
        process.platform == 'darwin'? '/tary@2x.png' : '/tary.png'));  // mac原图
    let trayMenuTemplate = [
        {
            label: "显示/隐藏",
            click: function() {
                return win.isVisible() ? win.hide() : win.show();
            }
        },
        {
            label: "退出",
            click: function() {
                win.close();
            }
        }
    ];
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);
    tray.setToolTip('播放器');
    tray.setContextMenu(contextMenu);
}
