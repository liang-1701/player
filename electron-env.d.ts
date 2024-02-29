// electron-env.d.ts
export interface IElectronAPI {
	// preload.ts中使用的方法，后面添加方法，此处也要同步申明
    winClose,
    winMax,
    winMin,
    openLyric,
    initDataFromMain,
    closeLyric,
    changeLyricState,
    playStatetoLyric,
    playStateFromMain,
    timetoLyric,
    timeFromMain
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}
