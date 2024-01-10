<template>
    <div class="container-play">
        <!-- 播放进度条 -->
        <div class="progress">
            <input type="range" class="play-progress" min="0" max="100" step="1" value="30">
        </div>
        <div class="play-content">
            <div class="play-info">
                <div class="play-cover">
                    <img src="/musicbg.png" alt="" onerror="this.src='/musicbg.png'"/>
                </div>
                <div class="info">
                    <div class="info-name">
                        <span>听点什么呢</span>
                    </div>
                    <div class="info-time">
                        <span class="current-time">00:00</span>
                        <span>/</span>
                        <span class="total-time">00:00</span>
                    </div>
                </div>
            </div>
            <div class="play-control">
                <div>
                    <svg t="1703726748044" class="icon" id="prev-control" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10931" width="25" height="25"><path d="M213.333333 512a52.92 52.92 0 0 0 25.78 45.666667l618.666667 373.28a53.333333 53.333333 0 0 0 80.886667-45.666667V138.72a53.333333 53.333333 0 0 0-80.886667-45.666667L239.133333 466.333333A52.92 52.92 0 0 0 213.333333 512z m-128 405.333333V106.666667a21.333333 21.333333 0 0 1 42.666667 0v810.666666a21.333333 21.333333 0 0 1-42.666667 0z" fill="#5C5C66" p-id="10932"></path></svg>
                </div>
                <div>
                    <svg t="1703727003306" class="icon" id="play-control" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11303" width="25" height="25"><path d="M512 42.666667C252.793333 42.666667 42.666667 252.793333 42.666667 512s210.126667 469.333333 469.333333 469.333333 469.333333-210.126667 469.333333-469.333333S771.206667 42.666667 512 42.666667z m196.546667 500.493333l-266.666667 176A37.333333 37.333333 0 0 1 384 688V336.033333a37.333333 37.333333 0 0 1 57.893333-31.16l266.666667 176a37.333333 37.333333 0 0 1 0 62.32z" fill="#5C5C66" p-id="11304"></path></svg>
                    <svg t="1703727089514" class="icon" id="pause-control" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11489" width="25" height="25"><path d="M512 42.666667C252.793333 42.666667 42.666667 252.793333 42.666667 512s210.126667 469.333333 469.333333 469.333333 469.333333-210.126667 469.333333-469.333333S771.206667 42.666667 512 42.666667z m106.666667 682.666666a21.333333 21.333333 0 0 1-21.333334-21.333333V320a21.333333 21.333333 0 0 1 42.666667 0v384a21.333333 21.333333 0 0 1-21.333333 21.333333z m-213.333334 0a21.333333 21.333333 0 0 1-21.333333-21.333333V320a21.333333 21.333333 0 0 1 42.666667 0v384a21.333333 21.333333 0 0 1-21.333334 21.333333z" fill="#5C5C66" p-id="11490"></path></svg>
                </div>
                <div>
                    <svg t="1703726970407" class="icon" id="next-control" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11117" width="25" height="25"><path d="M810.666667 512a52.92 52.92 0 0 1-25.78 45.666667l-618.666667 373.28a53.333333 53.333333 0 0 1-80.886667-45.666667V138.72a53.333333 53.333333 0 0 1 80.886667-45.666667l618.666667 373.28A52.92 52.92 0 0 1 810.666667 512z m128 405.333333V106.666667a21.333333 21.333333 0 0 0-42.666667 0v810.666666a21.333333 21.333333 0 0 0 42.666667 0z" fill="#5C5C66" p-id="11118"></path></svg>
                </div>
                <div @click.stop="playQueueOpen = !playQueueOpen">
                    <svg @click="" t="1703727118022" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11675" width="25" height="25"><path d="M426.666667 874.666667a21.333333 21.333333 0 0 1-21.333334 21.333333H64a21.333333 21.333333 0 0 1 0-42.666667h341.333333a21.333333 21.333333 0 0 1 21.333334 21.333334zM64 128h896a21.333333 21.333333 0 0 0 0-42.666667H64a21.333333 21.333333 0 0 0 0 42.666667z m0 384h597.333333a21.333333 21.333333 0 0 0 0-42.666667H64a21.333333 21.333333 0 0 0 0 42.666667z m896 341.333333h-85.333333a21.333333 21.333333 0 0 0 0 42.666667h85.333333a21.333333 21.333333 0 0 0 0-42.666667z m-90.053333-369.22c16.733333 17.42 23.806667 41.146667 26.533333 53.733334a21.333333 21.333333 0 1 0 41.706667-9.026667c-4.5-20.773333-14.666667-50.513333-37.466667-74.266667-11.04-11.493333-23.64-20.093333-37.493333-25.606666-10.306667-7.126667-19.44-16.58-27.153334-28.133334-19.64-29.393333-24.373333-64.04-25.446666-82.08A21.333333 21.333333 0 0 0 768 320v479.586667c-1.413333-1.02-2.846667-2-4.326667-3.006667-27.64-18.433333-64-28.58-102.34-28.58s-74.666667 10.146667-102.34 28.58c-14.253333 9.5-25.56 20.746667-33.613333 33.44-8.88 14-13.38 29.013333-13.38 44.666667s4.5 30.666667 13.38 44.666666c8.053333 12.666667 19.333333 23.94 33.613333 33.44C586.666667 971.186667 622.98 981.333333 661.333333 981.333333s74.666667-10.146667 102.34-28.58c14.253333-9.5 25.56-20.746667 33.613334-33.44 8.88-14 13.38-29.013333 13.38-44.666666V438a140.893333 140.893333 0 0 0 30.966666 27.82A21.18 21.18 0 0 0 846 468c8.706667 3.226667 16.766667 8.666667 23.946667 16.113333z" fill="#5C5C66" p-id="11676"></path></svg>
                </div>
            </div>
            <div class="play-voice">
                <div class="voice-control">
                    <svg t="1703729312696" class="icon" id="voice-none" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11866" width="25" height="25"><path d="M469.333333 106.666667v810.666666a21.333333 21.333333 0 0 1-36.42 15.086667L225.833333 725.333333H53.333333a53.393333 53.393333 0 0 1-53.333333-53.333333V352a53.393333 53.393333 0 0 1 53.333333-53.333333h172.5l207.08-207.086667A21.333333 21.333333 0 0 1 469.333333 106.666667z m548.42 612.42a21.333333 21.333333 0 0 0 0-30.173334L840.833333 512l176.92-176.913333a21.333333 21.333333 0 1 0-30.173333-30.173334L810.666667 481.833333 633.753333 304.913333a21.333333 21.333333 0 0 0-30.173333 30.173334L780.5 512l-176.92 176.913333a21.333333 21.333333 0 0 0 30.173333 30.173334L810.666667 542.166667l176.913333 176.92a21.333333 21.333333 0 0 0 30.173333 0z" fill="#5C5C66" p-id="11867"></path></svg>
                    <svg t="1703729886211" class="icon" id="voice-min" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12056" width="25" height="25"><path d="M469.333333 106.666667v810.666666a21.333333 21.333333 0 0 1-36.42 15.086667L225.833333 725.333333H53.333333a53.393333 53.393333 0 0 1-53.333333-53.333333V352a53.393333 53.393333 0 0 1 53.333333-53.333333h172.5l207.08-207.086667A21.333333 21.333333 0 0 1 469.333333 106.666667z m176.753334 299.726666a21.333333 21.333333 0 0 0-33.486667 26.433334 127.366667 127.366667 0 0 1 0 158.346666 21.333333 21.333333 0 0 0 33.493333 26.433334 170.733333 170.733333 0 0 0 0-211.213334z" fill="#5C5C66" p-id="12057"></path></svg>
                    <svg t="1703729931407" class="icon" id="voice-normal" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12242" width="25" height="25"><path d="M469.333333 106.666667v810.666666a21.333333 21.333333 0 0 1-36.42 15.086667L225.833333 725.333333H53.333333a53.393333 53.393333 0 0 1-53.333333-53.333333V352a53.393333 53.393333 0 0 1 53.333333-53.333333h172.5l207.08-207.086667A21.333333 21.333333 0 0 1 469.333333 106.666667z m146.793334 296.2a21.333333 21.333333 0 0 0-3.526667 29.96 127.366667 127.366667 0 0 1 0 158.346666 21.333333 21.333333 0 0 0 33.493333 26.433334 170.733333 170.733333 0 0 0 0-211.213334 21.333333 21.333333 0 0 0-29.966666-3.526666z m212.213333-19.3A339.393333 339.393333 0 0 0 753.333333 270.666667a346.585333 346.585333 0 0 0-22.046666-20.213334 21.333333 21.333333 0 1 0-27.446667 32.666667c6.666667 5.586667 13.146667 11.553333 19.333333 17.726667C779.6 357.22 810.666667 432.22 810.666667 512s-31.066667 154.78-87.48 211.186667c-6.173333 6.173333-12.666667 12.14-19.333334 17.726666a21.333333 21.333333 0 1 0 27.446667 32.666667 346.585333 346.585333 0 0 0 22.046667-20.213333 341.706667 341.706667 0 0 0 74.98-369.793334z" fill="#5C5C66" p-id="12243"></path></svg>
                    <svg t="1703729942981" class="icon" id="voice-max" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12428" width="25" height="25"><path d="M469.333333 106.666667v810.666666a21.333333 21.333333 0 0 1-36.42 15.086667L225.833333 725.333333H53.333333a53.393333 53.393333 0 0 1-53.333333-53.333333V352a53.393333 53.393333 0 0 1 53.333333-53.333333h172.5l207.08-207.086667A21.333333 21.333333 0 0 1 469.333333 106.666667z m146.793334 296.2a21.333333 21.333333 0 0 0-3.526667 29.96 127.366667 127.366667 0 0 1 0 158.346666 21.333333 21.333333 0 0 0 33.493333 26.433334 170.733333 170.733333 0 0 0 0-211.213334 21.333333 21.333333 0 0 0-29.966666-3.526666zM853.333333 512a340.32 340.32 0 0 0-100-241.333333 346.585333 346.585333 0 0 0-22.046666-20.213334 21.333333 21.333333 0 1 0-27.446667 32.666667c6.666667 5.586667 13.146667 11.553333 19.333333 17.726667C779.6 357.22 810.666667 432.22 810.666667 512s-31.066667 154.78-87.48 211.186667c-6.173333 6.173333-12.666667 12.14-19.333334 17.726666a21.333333 21.333333 0 1 0 27.446667 32.666667 346.585333 346.585333 0 0 0 22.046667-20.213333 340.32 340.32 0 0 0 100-241.333334z m133.173334-192.666667a508.806667 508.806667 0 0 0-112.466667-169.386666 518.346667 518.346667 0 0 0-57.533333-49.653334 21.333333 21.333333 0 0 0-25.42 34.273334 474.246667 474.246667 0 0 1 52.78 45.553333c182.993333 182.993333 182.993333 480.74 0 663.733333a474.853333 474.853333 0 0 1-52.78 45.553334 21.333333 21.333333 0 0 0 25.413333 34.273333 519.026667 519.026667 0 0 0 57.54-49.653333 512.546667 512.546667 0 0 0 112.466667-554.666667z" fill="#5C5C66" p-id="12429"></path></svg>
                </div>
                <div class="voice-progress">
                    <input type="range" class="play-voice-progress" min="0" max="1" step="0.01" value="0.3">
                </div>
            </div>
        </div>
        <div class="play-queue" :class="{playQueueOpen:!playQueueOpen}" @click.stop="playQueueOpen==true">
            <div class="queue-title">
                <div class="queue-title-text">播放队列({{ playStore.playQueue.length }})</div>
                <div class="queue-control">
                    <div title="操作">
                        <svg t="1704192055149" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3212" width="21" height="21"><path d="M978.56 224H379.52a32 32 0 0 1-32-32 32.64 32.64 0 0 1 32-32h599.04a32 32 0 0 1 32 32 32 32 0 0 1-32 32zM978.56 565.12H379.52a32 32 0 0 1-32-32 32.64 32.64 0 0 1 32-32h599.04a32 32 0 0 1 32 32 32 32 0 0 1-32 32zM978.56 906.88H379.52a32.64 32.64 0 0 1-32-32 32 32 0 0 1 32-32h599.04a32 32 0 0 1 32 32 32 32 0 0 1-32 32zM114.56 284.16a32.64 32.64 0 0 1-23.04-9.6L22.4 206.08a32.64 32.64 0 0 1 0-45.44 32 32 0 0 1 45.44 0l46.72 46.08 97.28-97.28a32 32 0 0 1 45.44 0 32.64 32.64 0 0 1 0 45.44L136.96 274.56a32 32 0 0 1-22.4 9.6zM114.56 618.88a32.64 32.64 0 0 1-23.04-9.6L22.4 540.16a32 32 0 0 1 0-44.8 32 32 0 0 1 45.44 0l46.72 46.08 97.28-97.28a32 32 0 0 1 45.44 0 32 32 0 0 1 0 44.8L136.96 609.28a32 32 0 0 1-22.4 9.6zM114.56 967.04a32.64 32.64 0 0 1-23.04-7.04L22.4 888.32a32.64 32.64 0 0 1 0-45.44 32.64 32.64 0 0 1 45.44 0l46.72 46.72 97.28-97.92a32 32 0 1 1 45.44 45.44L136.96 960a32 32 0 0 1-22.4 7.04z" fill="#323333" p-id="3213"></path></svg>
                    </div>
                    <div title="清空">
                        <svg t="1704192032029" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2964" width="21" height="21"><path d="M782.72 1014.4H233.6a92.8 92.8 0 0 1-83.84-101.12V288.64a32 32 0 1 1 64 0v624.64c0 23.04 12.16 37.76 20.48 37.76h549.12c8.32 0 20.48-14.72 20.48-37.76V288.64a32 32 0 1 1 64 0v624.64a92.8 92.8 0 0 1-85.12 101.12zM960 186.24H57.6a31.36 31.36 0 0 1-32-31.36 32 32 0 0 1 32-32H960a32 32 0 0 1 32 32 31.36 31.36 0 0 1-32 31.36zM665.6 72.96H350.72a32 32 0 1 1 0-64h314.88a32 32 0 1 1 0 64z" fill="#323333" p-id="2965"></path><path d="M407.04 873.6a31.36 31.36 0 0 1-31.36-31.36V341.76a32 32 0 1 1 64 0v500.48a31.36 31.36 0 0 1-32.64 31.36zM609.28 873.6a31.36 31.36 0 0 1-32-31.36V341.76a32 32 0 1 1 64 0v500.48a31.36 31.36 0 0 1-32 31.36z" fill="#323333" p-id="2966"></path></svg>
                    </div>
                </div>
            </div>
            <ul class="queue-list">
                <li v-for="(item) in playStore.playQueue" :key="item.index">
                    <div class="info">
                        <span class="name-line">{{ item.name }}</span>
                        <div class="info-line">
                            <div class="singer">
                                <span v-for="(singer, i) in item.singer">
                                    {{ singer.name }}
                                    <span v-if="i < item.singer.length - 1">, </span>  
                                </span>
                            </div>
                            <span class="time">{{ item.time }}</span>
                        </div>
                    </div>
                    <div class="control">
                        <svg t="1703991609601" class="icon play" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5474" width="21" height="21"><path d="M870.2 466.333333l-618.666667-373.28a53.333333 53.333333 0 0 0-80.866666 45.666667v746.56a53.206667 53.206667 0 0 0 80.886666 45.666667l618.666667-373.28a53.333333 53.333333 0 0 0 0-91.333334z" fill="#5C5C66" p-id="5475"></path></svg>
                        <svg t="1703991646436" class="icon pause" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5660" width="21" height="21"><path d="M426.666667 138.666667v746.666666a53.393333 53.393333 0 0 1-53.333334 53.333334H266.666667a53.393333 53.393333 0 0 1-53.333334-53.333334V138.666667a53.393333 53.393333 0 0 1 53.333334-53.333334h106.666666a53.393333 53.393333 0 0 1 53.333334 53.333334z m330.666666-53.333334H650.666667a53.393333 53.393333 0 0 0-53.333334 53.333334v746.666666a53.393333 53.393333 0 0 0 53.333334 53.333334h106.666666a53.393333 53.393333 0 0 0 53.333334-53.333334V138.666667a53.393333 53.393333 0 0 0-53.333334-53.333334z" fill="#5C5C66" p-id="5661"></path></svg>
                        <svg t="1704248260169" class="icon del" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4450" width="21" height="21"><path d="M412 744c-19.8 0-36-16.2-36-36V500c0-19.8 16.2-36 36-36s36 16.2 36 36v208c0 19.8-16.2 36-36 36zM612 744c-19.8 0-36-16.2-36-36V500c0-19.8 16.2-36 36-36s36 16.2 36 36v208c0 19.8-16.2 36-36 36z" fill="#333333" p-id="4451"></path><path d="M923.8 248H736v-82c0-56.2-45.8-102-102-102H390c-56.2 0-102 45.8-102 102v82H100.2C80.3 248 64 264.2 64 284s16.3 36 36.2 36H192v518c0 16.4 3.2 32.4 9.6 47.5 6.1 14.5 14.9 27.6 26.1 38.8 11.2 11.2 24.2 20 38.8 26.1 15.1 6.4 31.1 9.6 47.5 9.6h396c16.4 0 32.4-3.2 47.5-9.6 14.5-6.1 27.6-14.9 38.8-26.1 11.2-11.2 20-24.2 26.1-38.8 6.4-15.1 9.6-31.1 9.6-47.5V320h91.8c19.9 0 36.2-16.2 36.2-36s-16.3-36-36.2-36zM360 166c0-16.6 13.4-30 30-30h244c16.6 0 30 13.4 30 30v82H360v-82z m400 672c0 27.6-22.4 50-50 50H314c-27.6 0-50-22.4-50-50V320h496v518z" fill="#333333" p-id="4452"></path></svg>
                    </div>
                </li>
            </ul>
            <div class="queue-foot">
                <div class="queue-close" @click.stop="playQueueOpen = !playQueueOpen">
                    <svg t="1703727118022" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="11675" width="15" height="15"><path d="M426.666667 874.666667a21.333333 21.333333 0 0 1-21.333334 21.333333H64a21.333333 21.333333 0 0 1 0-42.666667h341.333333a21.333333 21.333333 0 0 1 21.333334 21.333334zM64 128h896a21.333333 21.333333 0 0 0 0-42.666667H64a21.333333 21.333333 0 0 0 0 42.666667z m0 384h597.333333a21.333333 21.333333 0 0 0 0-42.666667H64a21.333333 21.333333 0 0 0 0 42.666667z m896 341.333333h-85.333333a21.333333 21.333333 0 0 0 0 42.666667h85.333333a21.333333 21.333333 0 0 0 0-42.666667z m-90.053333-369.22c16.733333 17.42 23.806667 41.146667 26.533333 53.733334a21.333333 21.333333 0 1 0 41.706667-9.026667c-4.5-20.773333-14.666667-50.513333-37.466667-74.266667-11.04-11.493333-23.64-20.093333-37.493333-25.606666-10.306667-7.126667-19.44-16.58-27.153334-28.133334-19.64-29.393333-24.373333-64.04-25.446666-82.08A21.333333 21.333333 0 0 0 768 320v479.586667c-1.413333-1.02-2.846667-2-4.326667-3.006667-27.64-18.433333-64-28.58-102.34-28.58s-74.666667 10.146667-102.34 28.58c-14.253333 9.5-25.56 20.746667-33.613333 33.44-8.88 14-13.38 29.013333-13.38 44.666667s4.5 30.666667 13.38 44.666666c8.053333 12.666667 19.333333 23.94 33.613333 33.44C586.666667 971.186667 622.98 981.333333 661.333333 981.333333s74.666667-10.146667 102.34-28.58c14.253333-9.5 25.56-20.746667 33.613334-33.44 8.88-14 13.38-29.013333 13.38-44.666666V438a140.893333 140.893333 0 0 0 30.966666 27.82A21.18 21.18 0 0 0 846 468c8.706667 3.226667 16.766667 8.666667 23.946667 16.113333z" fill="#5C5C66" p-id="11676"></path></svg>
                    <span>关闭</span>
                </div>
            </div>
        </div>
        <audio></audio>
    </div>
</template>

<script  lang="ts" setup>
import playMusic from "@/store/modules/playMusic";
import { ref } from "vue";
let playStore = playMusic();

const playQueueOpen = ref(false)

const closeQueue = () => {
    playQueueOpen.value = false;
}
document.addEventListener("click", closeQueue)

</script>

<style lang="scss" scoped>
.progress {
    .play-progress {
        appearance: none;
        width: 100%;
        height: 3px;
        background-color: #ddd;
        border-radius: 15px;
        background: -webkit-linear-gradient(var(--progress-color), var(--progress-color)) no-repeat #cccccc;
        background-size: 10% 100%;
    }
    .play-progress::-webkit-slider-thumb {
        appearance: none;
        width: 10px;
        height: 10px;
        background-color: var(--progress-color);
        border-radius: 50%;
        cursor: pointer;
    }
}
.play-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .play-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 20px;
        .play-cover img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            animation: play-img 5s linear infinite;
            animation-play-state: running;
        }
        @keyframes play-img {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .info {
            margin-left: 20px;
            color: var(--play-name-time-color);
            width: 150x;
            .info-name {
                width: 150px;
                display: inline-block;
                overflow: hidden;
                white-space: nowrap;
                span {
                    animation: text-scroll 5s linear infinite alternate;
                    float: left;
                    min-width: 100%;
                }
                @keyframes text-scroll {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(calc(150px - 100%)); }
                }
            }
        }
    }
    .play-control {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: -50px;
        div {
            margin-left: 15px;
            cursor: pointer;
        }
        div:hover path {
            fill: var(--control-btn-color);
        }
        #pause-control {
            display: none;
        }
    }
    .play-voice {
        margin-right: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .voice-control {
            cursor: pointer;
            svg:not(#voice-normal) {
                display: none;
            }
        }
        .voice-control:hover path {
            fill: var(--control-btn-color);
        }
        .voice-progress {
            width: 80px;
            display: flex;
            align-items: center;
            margin-left: 10px;
            .play-voice-progress {
                appearance: none;
                width: 100%;
                height: 3px;
                background-color: #ddd;
                border-radius: 15px;
                background: -webkit-linear-gradient(var(--progress-color), var(--progress-color)) no-repeat #cccccc;
                background-size: 10% 100%;
            }
            .play-voice-progress::-webkit-slider-thumb {
                appearance: none;
                width: 10px;
                height: 10px;
                background-color: var(--progress-color);
                border-radius: 50%;
                cursor: pointer;
            }
        }
    }
}
.play-queue {
    position: fixed;
    height: 100%;
    width: 30%;
    max-width: 350px;
    background-color: var(--bg-color);
    right: 0;
    top: 0;
    transition: all 0.5s;
    box-shadow: -8px 0 5px -5px #e0e0e0;
    .queue-title {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 20px;
        .queue-title-text {
            font-size: 20px;
            font-weight: bold;
            line-height: 100%;
        }
        .queue-control {
            height: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 50px;
            div {
                cursor: pointer;
            }
            div:hover path {
                fill: var(--control-btn-color);
            }
        }
    }
    .queue-list {
        overflow-y: auto;
        height: calc(100% - 120px);
        list-style: none;
        padding: 0 10px;
        li {
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 10px;
            width: calc(100% - 20px);
            line-height: 20px;
            margin: 5px 0px;
            padding: 5px 10px;
            > div {
                width: 100%;
            }
            .info {
                display: flex;
                flex-direction: column;
                overflow: hidden;
                .name-line {
                    font-size: 16px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width: 100%;
                }
                .info-line {
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    opacity: 0.5;
                    .singer {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: calc(100% - 30px);
                    }
                    .time {
                        width: 30px;
                    }
                }
            }
            .control {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 60px;
                display: none;
                .pause {
                    display: none;
                }
                svg {
                    cursor: pointer;
                }
                svg:hover path {
                    fill: var(--control-btn-color);
                }
            }
        }
        li:hover {
            background-color: var(--music-detail-list-hover-color);
        }
        li:hover .control{
            display: block;
        }
        li:hover .info-line .time{
            display: none;
        }
    }
    .queue-list::-webkit-scrollbar {
        width: 10px;
    }
    .queue-list::-webkit-scrollbar-thumb {
        background: var(--scrollbar-color);
        border-radius: 6px;
    }
    .queue-foot {
        margin: 20px;
        .queue-close {
            float: right;
            font-size: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        .queue-close:hover path, .queue-close:hover span{
            color: var(--control-btn-color);
            fill: var(--control-btn-color);
        }
    }
}
.playQueueOpen {
    right: -31%;
}
</style>