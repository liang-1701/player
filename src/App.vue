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
const plat = ref('')

const setMin = () => {
    window.api.winMin();
}
const setMax = () => {
    window.api.winMax({ winMax: winMax.value});
    const app = document.getElementById("app") as HTMLElement;
    winMax.value = !winMax.value
    if (winMax.value) {
        app.style.borderRadius = "0px";
    }else {
        app.style.borderRadius = "10px";
    }
}
const setCls = () => {
    window.api.winClose();
}

window.api.getPlatform((platform:any) => {
    plat.value = platform;
});

provide("win-enevt", {
    winMax,
    plat,
    setMin,
    setMax,
    setCls,
})
</script>

<style lang="scss" scoped>
$layout-title-height: 50px;
.title {
    height: 50px;
}
.main {
    flex: 1;
    overflow: hidden;
}
</style>