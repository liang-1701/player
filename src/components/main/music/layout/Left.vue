<template>
    <div class="container-left">
        <div class="title"> {{ musicStore.menus!.meta.title }}</div>
        <div class="plat-list">
           <el-menu class="plat-menu" style="border-right: none;" :default-active="$router.currentRoute.value.params.id">
                <el-menu-item class="plat" @click="changePlat(item)" v-for="(item) in musicStore.menus!.meta.platform" :index="item.id">{{item.name}}</el-menu-item>
            </el-menu>
        </div>
    </div>
</template>

<script  lang="ts" setup>
import musicResource from "@/store/modules/musicResource";
import { useRouter } from 'vue-router';
import { inject } from 'vue';

let $router = useRouter();
let musicStore = musicResource();
const musicEnevt:any = inject("music-enevt");

const changePlat = async (item:any) => {
    await musicStore.setCurrentPlat(item);
    $router.push({path: `/square/${item.id}`});
    musicEnevt.initDefaultClass();
}
</script>

<style lang="scss" scoped>
.container-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 10px;
    .title {
        font-weight: bold;
        font-size: 18px;
        color: var(--title-txet-color);
        margin-bottom: 10px;
    }
    .plat-list {
        .is-active, .is-active:hover {
            background-color: var(--button-color-active);
        }
        .plat:not(.is-active):hover {
            background-color: var(--button-color-hover);
        }
        .plat {
            height: 40px;
            border-radius: 10px;
            margin-top: 10px;
            padding: 10px;
        }
        .plat-menu {
            background-color: var(--bg-color);
        }
    }
}
</style>