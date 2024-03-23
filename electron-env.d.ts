// electron-env.d.ts
export interface IElectronAPI {
	// preload.ts中使用的方法，后面添加方法，此处也要同步申明
    winClose,
    winMax,
    winMin,
    nextSong,
    prevSong,
    togglePlayState,
    showMainWindow,
    hideMainWindow,
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
    sendPlayListFromMicro,
    playSong,
    playSongFromMain,
    quitAskFromMain
}

declare global {
  interface Window {
    api: IElectronAPI;
    c: any;
  }
}
