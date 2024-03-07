<template>
    <div class="container drag">
        <div class="win-platform" v-if="winEnevt.plat.value!='darwin'">
            <div class="name">PLAYER</div>
            <div class="opt no-drag">
                <left-c @click="$router.back()" theme="outline" size="22" fill="#333" :strokeWidth="2" />
                <right-c @click="$router.forward()" theme="outline" size="22" fill="#333" :strokeWidth="2" />
            </div>
            <div class="search">
                <el-input class="search-text no-drag" v-model="searchText" placeholder="搜一搜想听的" clearable @change="search"></el-input>
            </div>
            <div class="win-control no-drag">
                <Setting @click="$router.push('/setting')" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
                <Minus @click="winEnevt.setMin()" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
                <Square @click="winEnevt.setMax()" v-if="!winEnevt.winMax.value" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
                <MinusTheTop @click="winEnevt.setMax()" v-else theme="outline" size="20" fill="#333" :strokeWidth="2"/>
                <Close @click="winEnevt.setCls()" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
            </div>
        </div>
        <div class="mac-platform drag" v-else>
            <div class="win-control no-drag">
            </div>
            <div class="opt no-drag">
                <left-c @click="$router.back()" theme="outline" size="22" fill="#333" :strokeWidth="2" />
                <right-c @click="$router.forward()" theme="outline" size="22" fill="#333" :strokeWidth="2" />
            </div>
            <div class="search">
                <el-input class="search-text no-drag" v-model="searchText" placeholder="搜一搜想听的" clearable @change="search"></el-input>
            </div>
            <div class="control no-drag">
                <Setting @click="$router.push('/setting')" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
            </div>
            <div class="name">PLAYER</div>
        </div>
    </div>
</template>

<script  lang="ts" setup>
import { Setting, Minus, Close, MinusTheTop, Square, RightC, LeftC } from '@icon-park/vue-next'
import { ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import musicResource from "@/store/modules/musicResource";

let musicStore = musicResource();
let $router = useRouter();
const searchText = ref('')
const winEnevt:any = inject('win-enevt')

const search = () => { // 搜索
    if(searchText.value) {
        musicStore.currSearchPlat=musicStore.currentPlat;
        musicStore.searchSongs(searchText.value, 1);
        $router.push('/searchMusic');
    }
}

</script>

<style lang="scss" scoped>
.container {
    .win-platform{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        >div {
            margin: 0 20px;
        }
        .name {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            width: 150px;
            text-align: center;
        }
        .opt > * {
            padding: 3px 5px;
            cursor: pointer;
            &:hover :deep(path) {
                stroke:var(--icon-color-hover);
            }
        }
        .search {
            flex: 1;
            .search-text {
                width: 200px;
            }
        }
        .win-control > * {
            padding: 3px 5px;
            &:hover {
                background-color: var(--header-bg-color-hover);
            }
        }
    }
    .mac-platform{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        .win-control {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 150px;
        }
        .name {
            font-size: 20px;
            font-weight: 600;
            color: #333;
            width: 150px;
            text-align: center;
        }
        .opt {
            margin: 0 40px;
        }
        .opt > * {
            padding: 3px 5px;
            cursor: pointer;
            &:hover :deep(path) {
                stroke:var(--icon-color-hover);
            }
        }
        .control {
            cursor: pointer;
        }
        .search {
            flex: 1;
            .search-text {
                width: 200px;
            }
        }
    }
}
</style>