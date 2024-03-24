<template>
    <div class="container-square">
        <Tag class="tag" />
        <div ref="square" class="square">
            <div class="category" v-for="item in musicStore.square.squareItems" @click="musicStore.getSquareDetail(item.id, item.group, item.data);goSquareDetail();">
                <div class="img" >
                    <img v-lazy="item.imgUrl" @load="">
                    <div class="cover">
                        <play theme="filled" size="40" fill="#333"/>
                    </div>
                </div>
                <div class="title">{{ item.title }}</div>
            </div>
            <div class="category-page" v-if="musicStore.square.page">
                <el-pagination v-model:current-page="currentPage" @current-change="musicEnevt.getSquare(musicEnevt.defaultClass.value, currentPage);scrolling()" :hide-on-single-page="true" :page-size="musicStore.square.page?.size" :pager-count="7" layout="prev, pager, next, jumper" :total="musicStore.square.page?.total" :page-count="musicStore.square.page?.totalPage" prev-text="上一页" next-text="下一页" />
            </div>
        </div>
    </div>
</template>

<script  lang="ts" setup>
import  Tag from "./Tag.vue";
import { Play } from '@icon-park/vue-next'
import musicResource from "@/store/modules/musicResource";
import { inject, ref } from "vue";
import { useRouter } from 'vue-router';

let $router = useRouter();
const currentPage = ref(1);
const musicEnevt:any = inject("music-enevt");
let musicStore = musicResource();
const square = ref<HTMLElement>();

const goSquareDetail = () => {
    $router.push('/squareDetail');
}

const scrolling = () => {
    square.value!.scrollTo(0, 0);
}
</script>

<style lang="scss" scoped>
.container-square {
    display: flex;
    flex-direction: column;
    .tag {
        height: 30px;
    }
    .square {
        padding: 0 10px;
        flex: 1;
        margin: 10px 0;
        overflow-y: auto;
        overflow-x: hidden;
        .category {
            display: inline-block;
            margin: 20px;
            width: 125px;
            height: 170px;
            border-radius: 5px;
            box-shadow:  0 0 6px #c5c5c5, 0 0 6px #ffffff;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            &:hover {
                transform: scale(1.1);
            }
            .img {
                position: relative;
                width: 125px;
                height: 125px;
                .cover {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    background-color: rgba(#a9a6a6, 0.6);
                    visibility: hidden;
                }
                &:hover .cover {
                    visibility: visible;
                }
                .cover > *:hover :deep(path:first-child) {
                    fill: var(--icon-color-hover);
                    stroke: var(--icon-color-hover);
                }
                img {
                    width: 100%;
                    height: 100%;
                }
            }
            .title {
                overflow: hidden;
                font-size: 12px;
                margin: 5px 2px 0 2px;
            }
            .title:hover {
                color: var(--text-color-hover);
            }
        }
    }
    .category-page {
        display: flex;
        justify-content: center;
        align-items: center;
        :deep(.el-pagination .el-pager li) {
            margin: 0 3px;
        }
        :deep(.el-pagination .el-pager li), :deep(.el-pagination button) {
            background-color: var(--bg-color);
        }
        :deep(.el-pager li.is-active) {
            color: var(--button-color-active);
        }
        :deep(.el-pagination button:hover), :deep(.el-pagination li:hover) {
            color: var(--button-color-hover);
        }
    }
}
</style>