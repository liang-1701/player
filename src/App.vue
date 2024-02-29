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
import { ref, provide } from "vue";

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

provide("win-enevt", {
    winMax,
    setMin,
    setMax,
    setCls,
})
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