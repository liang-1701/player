<template>
    <div class="container-singer">
        <div class="categories">
            <div class="category" v-for="(category, index) in musicStore.singerSquare">
                <span class="cate" :data-id="item.id" :data-id2="current[index]" @click="getSingersByTypes(index, item.id);" :class="{active:item.id==current[index]}" v-for="item in category.categories">
                    {{ item.name }}
                </span>
            </div>
            <div class="category">
                <span class="cate"  @click="getSingersByTypes(current.length - 1, 'all');" :class="{active:'all'==current[current.length - 1]}">全部</span>
                <span class="cate"  @click="getSingersByTypes(current.length - 1, item);" :class="{active:item==current[current.length - 1]}" v-for="item in Array.from('abcdefghijklmnopqrstuvwxyz')">
                    {{ item.toUpperCase() }}
                </span>
                <span class="cate"  @click="getSingersByTypes(current.length - 1, '#');" :class="{active:'#'==current[current.length - 1]}">#</span>
            </div>
        </div>
        <div class="singers">
            <div class="singer" v-for="singer in musicStore.singers" @click="musicEnevt.getSingerDetail(singer)">
                <div class="img" >
                    <img v-lazy="singer.img" alt="">
                    <div class="cover">
                        <play theme="filled" size="40" fill="#333"/>
                    </div>
                </div>
                <span class="name">{{ singer.name }}</span>
            </div>
        </div>
    </div>
</template>

<script  lang="ts" setup>
import { Play } from '@icon-park/vue-next'
import musicResource from "@/store/modules/musicResource";
import { inject, onMounted, ref } from "vue";

let musicStore = musicResource();
const musicEnevt:any = inject("music-enevt");
const current = ref<string[]>([]);

const getSingersByTypes = async (index:any, val:any) => {
    current.value[index] = val;
    console.log(current.value);
    musicStore.getSingersByTypes(current.value);
}

onMounted(async () => {
    await musicStore.getAllSingers();
    musicStore.singerSquare.forEach((item:any) => {
        current.value.push(item.categories[0].id);
    })
    current.value.push('all');
})
</script>

<style lang="scss" scoped>
.container-singer {
    .categories {
        display: flex;
        flex-direction: column;
        .category {
            display: flex;
            flex-wrap: wrap;
            .cate {
                padding: 5px 10px;
                border-radius: 5px;
                margin: 5px 5px 0 0;
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
    .singers {
        display: flex;
        flex-wrap: wrap;
        overflow-y: auto;
        overflow-x: hidden;
        .singer {
            display: inline-block;
            margin: 20px;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            align-items: center;
            .img {
                position: relative;
                width: 125px;
                height: 125px;
                .cover {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    border-radius: 50%;
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
                    border-radius: 50%;
                }
            }
            .name {
                margin-top: 10px;
                font-size: 18px;
                &:hover {
                    color: var(--text-color-hover);
                }
            }
            &:hover {
                transform: scale(1.1);
            }
        }
    }
}
</style>