<template>
    <Title class="title" />
    <router-view v-slot="{ Component }" class="main">
        <KeepAlive>
            <component :is="Component"/>
        </KeepAlive>
    </router-view>
</template>

<script  lang="ts" setup>
import Title from "@/components/title/Title.vue";

</script>

<style lang="scss" scoped>
$layout-title-height: 50px;
.title {
    position: fixed;
    height: $layout-title-height;
    width: 100%;
    -webkit-app-region: drag;
}
.main {
    position: fixed;
    top: $layout-title-height;
    width: 100%;
    height: calc(100% - $layout-title-height);
}
</style>