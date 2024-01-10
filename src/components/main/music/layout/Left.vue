<template>
    <div class="container-left">
        <div class="plat-title"> {{ musicStore.menus.meta.title }}</div>
        <div class="plat-list">
            <el-menu class="plat-menu" style="border-right: none;" :default-active="musicStore.defaultId.path" router>
                <el-menu-item class="plat" v-for="(item) in musicStore.menus.children.filter(item => item.meta.type=='platform')" :index="item.path" @click="changePlat">{{item.meta.title}}</el-menu-item>
            </el-menu>
        </div>
    </div>
</template>

<script  lang="ts" setup>
import musicResource from "@/store/modules/musicResource";

let musicStore = musicResource();


const changePlat = (e:any) => {
    
    musicStore.setDefaultMenu(e.index);
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