<template>
    <Title class="title" />
    <router-view v-slot="{ Component }" class="main">
        <KeepAlive>
            <component :is="Component"/>
        </KeepAlive>
    </router-view>
</template>

<script  lang="ts" setup>
import Title from "@/components/Title.vue";

</script>

<style lang="scss" scoped>
$layout-title-height: 50px;
.title {
    min-height: 50px;
}
.main {
    flex: 1;
    overflow: hidden;
}
</style>