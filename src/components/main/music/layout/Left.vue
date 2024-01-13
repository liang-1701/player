<template>
    <div class="container-left">
        <div class="plat-title"> {{ musicStore.menus!.meta.title }}</div>
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
const alltag:any = inject("all-tag");

const changePlat = async (item:any) => {
    await musicStore.setCurrentPlat(item);
    $router.push({path: `/category/${item.id}`});
    alltag.initDefaultClass();
}

</script>

<style lang="scss" scoped>
.plat-title {
    display: flex;
    height: 40px;
    align-items: center;
    justify-content:center;
    font-size: 18px;
    color: var(--tille-txet-color);
    font-weight: bold;
}
.plat-list {
    display: flex;
    align-items: center;
    justify-content:center;
    .is-active, .is-active:hover {
        background-color: var(--bg-color-active);
    }
    .plat:not(.is-active):hover {
        background-color: var(--bg-color-hover);
    }
    .plat {
        color: var(--text-color);
        height: 40px;
        border-radius: 10px;
        margin-top: 10px;
    }
    .plat-menu {
        background-color: var(--bg-color);
    }
}
</style>