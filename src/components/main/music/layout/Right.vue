<template>
    <div class="container-right">
        <router-view  v-slot="{ Component }" class="content">
            <transition name="fade-main" mode="out-in" >
                <KeepAlive>
                    <component :key="$router.currentRoute.value.fullPath" :is="Component"/>
                </KeepAlive>
            </transition>
        </router-view>
        <Play class="play" />
    </div>
</template>

<script  lang="ts" setup>
import Play from "./Play.vue"
</script>

<style lang="scss" scoped>
.container-right {
    display: flex;
    flex-direction: column;
    .content {
        overflow-y: auto;
        flex: 1;
    }
    .play {
        height: 70px;
    }
}
</style>