<template>
    <div class="container-tag">
        <more-app @click="allTag=!allTag" theme="outline" size="16" fill="#333"/>
        <span class="tag-span" v-for="(item) in musicStore.categoriesDetail" :class="{active:musicEnevt.defaultClass.value==item.categoryId}" @click="musicEnevt.setDefaultClass(item.categoryId);musicEnevt.getSquare(item.categoryId, 1);">
                {{item.categoryName}}
        </span>
        <el-drawer v-model="allTag" title="全部分类" style="background-color: var(--bg-color);">
            <div class="current-tag">{{ musicStore.categoriesDetail.find(item => item.categoryId == musicEnevt.defaultClass.value)?.categoryName }}</div>
            <div class="all-tag">
                <div v-for="(item) in musicStore.categories">
                    <div class="title">
                        <span>{{ item.name }}</span>
                    </div>
                    <div class="detail">
                        <span class="all-tag-span" v-for="(item1) in item.categoryItems" :class="{active:musicEnevt.defaultClass.value==item1.categoryId}" @click="musicEnevt.setDefaultClass(item1.categoryId);musicEnevt.getSquare(item1.categoryId, 1);">{{item1.categoryName}}</span>
                    </div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script  lang="ts" setup>
import { MoreApp } from '@icon-park/vue-next'
import musicResource from "@/store/modules/musicResource";
import { inject, ref } from "vue";

const musicEnevt:any = inject("music-enevt");
let musicStore = musicResource();
const allTag = ref(false);

</script>

<style lang="scss" scoped>
.container-tag {
    overflow: hidden;
    > * {
        line-height: 30px;
        cursor: pointer;
    }
    .tag-span {
        display: inline-block;
        border-radius: 5px;
        padding: 0 5px;
        margin-left: 15px;
        margin-bottom: 10px;
        box-shadow:  0 0 6px #c5c5c5, 0 0 6px #ffffff;
        &:not(.active):hover {
            background-color: var(--button-color-hover);
            transition:transform 0.3s ease-in;
            transform: scale(1.1);
        }
        &.active {
            background-color: var(--button-color-active);
            transition: background-color 0.3s ease-in;
        }
    }
    :deep(.el-drawer__header) {
        margin-bottom: 0;
    }
    :deep(.el-drawer__body) {
        display: flex;
        flex-direction: column;
        padding: 0;
        .current-tag {
            line-height: 40px;
            text-align: center;
            margin-bottom: 10px;
            color: var(--text-color-active);
            
        }
        .all-tag {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 10px;
            .title {
                text-align: center;
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            .all-tag-span {
                display: inline-block;
                border-radius: 5px;
                padding: 2px 5px;
                margin-left: 15px;
                margin-bottom: 10px;
                cursor: pointer;
                &:not(.active):hover {
                    background-color: var(--button-color-hover);
                    transition:transform 0.3s ease-in;
                    transform: scale(1.1);
                }
                &.active {
                    background-color: var(--button-color-active);
                    transition: background-color 0.3s ease-in;
                }
            }
        }
    }
}
</style>