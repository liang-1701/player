<template>
    <el-drawer v-model="alltag.musicListOpen.value" title="全部分类" style="background-color: var(--bg-color);">
         <div class="current-class">
             <span>{{ currentClass }}</span>
         </div>
         <div class="class-detail">
             <div v-for="(item) in musicStore.categories">
                 <div class="title">
                     <span>{{ item.categoryGroupName }}</span>
                 </div>
                 <div class="detail">
                     <span class="tag-span" v-for="(item1) in item.items" :class="{tagClassActive:alltag.defaultClass.value==item1.categoryId?true:false}" @click="alltag.getRadio(item1.categoryId); alltag.setDefaultClass(item1.categoryId);">{{item1.categoryName}}</span>
                 </div>
             </div>
         </div>
     </el-drawer>
</template>

<script  lang="ts" setup>
import musicResource from "@/store/modules/musicResource";
import { inject, watch, ref } from "vue";

let musicStore = musicResource();
const alltag:any = inject("all-tag");

const currentClass = ref("");

watch(
 () => alltag.defaultClass.value,
 (newval) => {
     let a1 = musicStore.categoriesDetail.find(item => item.categoryId == newval)
     if (newval == 999999) {
         currentClass.value = "推荐";
     }else if (newval == 999998) {
         currentClass.value = "排行榜";
     }else {
         currentClass.value = a1!.categoryName;
     }
 },
 { 
     immediate: true
 }
)
</script>

<style lang="scss" scoped>
.current-class {
 color: var(--text-color-active);
 display: flex;
 align-items: center;
 justify-content: center;
 margin-top: -32px;
 span {
     position: fixed;
 }
}
.class-detail {
 margin-top: 20px;
 .title {
     display: flex;
     align-items: center;
     justify-content: center;
     font-weight: bold;
     margin-top: 10px;
     margin-bottom: 10px;
 }
 .detail {
     display: flex;
     flex-wrap: wrap;
     span {
         margin-bottom: 10px;
     }
 }
 .tag-span:not(.tagClassActive):hover {
     background-color: var(--bg-color-hover);
 }
 .tag-span {
     cursor: pointer;
     border-radius: 5px;
     background-color: var(--bg-color);
     color: var(--text-color);
     margin-left: 15px;
     padding: 1px 7px;
 }
 .tagClassActive {
     background-color: var(--bg-color-active);
     transition: background-color 0.3s ease-in;
 }
}
</style>