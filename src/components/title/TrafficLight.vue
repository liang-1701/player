<template>
    <div class="close" @click="winEnevt.setCls()">
        <svg viewBox="0 -1 32 32" xmlns="http://www.w3.org/2000/svg"><g id="cross"><line class="cls-1" x1="7" x2="25" y1="7" y2="25" /><line class="cls-1" x1="7" x2="25" y1="25" y2="7" /></g></svg>
    </div>
    <div class="min" @click="winEnevt.setMin()">
        <svg viewBox="0 0 256 256" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M208,134.4H48c-3.534,0-6.4-2.866-6.4-6.4s2.866-6.4,6.4-6.4h160c3.534,0,6.4,2.866,6.4,6.4S211.534,134.4,208,134.4z" /></svg>
    </div>
    <div class="max" @click="winEnevt.setMax()">
        <svg v-if="!winEnevt.winMax.value" viewBox="-3 -3 30 30" xmlns="http://www.w3.org/2000/svg"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M2,18V2H18" /><path class="cls-1" d="M23,6V22H7" /></g></g></svg>
        <svg v-else viewBox="0 0 35.82 35.82" xmlns="http://www.w3.org/2000/svg"><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><g id="Layer_2-2" data-name="Layer 2"><g id="Layer_1-2-2" data-name="Layer 1-2"><path d="M19.82,35.82v-16h16" /><path d="M15,0l1,16H0" /></g></g></g></g></svg>
    </div>
</template>

<script  lang="ts" setup>
import { inject } from 'vue';
const winEnevt:any = inject('win-enevt')
</script>

<style lang="scss" scoped>
.close, .min, .max {
    width: 13px;
    height: 13px;
    margin-right: 8px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
        fill: #555;
        stroke-width: 3.6px;
        stroke: #555;
        padding: 1px;
        visibility: hidden;
    }
    &:hover svg{
        visibility: visible;
    }
    &.close {
        background-color: #fc605c;
    }
    &.min {
        background-color: #fdbc40;
        svg {
            stroke-width: 28px !important;
        }
    }
    &.max {
        background-color: #34c648;
        svg {
            stroke-width: 3px !important;
            width: 8px;
            height: 8px;
        }
    }
}
</style>