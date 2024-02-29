<template>
    <div class="container drag">
        <div class="name">PLAYER</div>
        <div class="opt no-drag">
            <left-c @click="$router.back()" theme="outline" size="22" fill="#333" :strokeWidth="2" />
            <right-c @click="$router.forward()" theme="outline" size="22" fill="#333" :strokeWidth="2" />
        </div>
        <div class="search">
            <el-input class="search-text no-drag" v-model="searchText" placeholder="搜一搜想听的" clearable @change=""></el-input>
        </div>
        <div class="win-control no-drag">
            <Setting @click="$router.push('/setting')" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
            <Minus @click="setMin()" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
            <Square @click="setMax()" v-if="!winMax" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
            <MinusTheTop @click="setMax()" v-else theme="outline" size="20" fill="#333" :strokeWidth="2"/>
            <Close  @click="setCls()" theme="outline" size="20" fill="#333" :strokeWidth="2"/>
        </div>
    </div>
</template>

<script  lang="ts" setup>
import { Setting, Minus, Close, MinusTheTop, Square, RightC, LeftC } from '@icon-park/vue-next'
import { ref } from 'vue';
import { useRouter } from 'vue-router';

let $router = useRouter();
const searchText = ref('')
const winMax = ref(false)

const setMin = () => {
    window.api.winMin();
}
const setMax = () => {
    window.api.winMax({ winMax: winMax.value});
    winMax.value = !winMax.value
}
const setCls = () => {
    window.api.winClose();
}

</script>

<style lang="scss" scoped>
.container {
    display: flex;
    justify-content: space-between;
    align-items: center;
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
</style>