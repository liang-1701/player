<template>
    <Title class="title" />
    <router-view v-slot="{ Component }" class="main">
        <KeepAlive>
            <component :is="Component"/>
        </KeepAlive>
    </router-view>
    <dialog class="close-dialog" id="close-dialog">
        <div>
            <div class="tip">
                <el-radio-group class="select" v-model="quit">
                    <el-radio :label="1">最小化到托盘</el-radio>
                    <el-radio :label="2">直接退出</el-radio>
                </el-radio-group>
            </div>
            <div class="btn">
                <div @click="quitWin">确定</div>
                <div @click="cancleWin">取消</div>
            </div>
        </div>
    </dialog>
</template>

<script  lang="ts" setup>
import Title from "@/components/Title.vue";
import { ref, provide } from "vue";

const winMax = ref(false)
const plat = ref('')
const quit = ref(1)
const defaltQuit = ref(false)

const quitAsk = () => {
    if(defaltQuit.value) return
    const closeDialog = document.getElementById("close-dialog") as HTMLDialogElement;
    closeDialog.showModal();
}

window.api.quitAskFromMain(quitAsk)

const quitWin = () => {
    const closeDialog = document.getElementById("close-dialog") as HTMLDialogElement;
    closeDialog.close();
    if (quit.value == 1) {
        window.api.hideMainWindow();
    }else if(quit.value == 2) {
        window.api.winClose();
    }
}

const cancleWin = () => {
    const closeDialog = document.getElementById("close-dialog") as HTMLDialogElement;
    closeDialog.close();
}

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
    // window.api.winClose();
    quitAsk();
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
.close-dialog {
    border: #0005 1px solid;
    border-radius: 5px;
    box-shadow: 0 0 20px #0005;
    padding: 20px 30px;
    &::backdrop {
        background-color: #3335;
    }
    > div {
        display: flex;
        flex-direction: column;
        .select {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: flex-start;
            :deep(.is-checked .el-radio__label) {
                color: var(--text-color-active);
            }
            :deep(.is-checked .el-radio__inner) {
                background-color: var(--text-color-active);
                border-color: var(--text-color-active);
            }
        }
        .btn {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 10px 0 10px;
            > * {
                cursor: pointer;
                &:hover {
                    color: var(--text-color-hover)
                }
            }
        }
    }
}
</style>