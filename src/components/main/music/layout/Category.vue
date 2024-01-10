<template>
    <div class="container-category">
        <div class="tag">
            <div class="tag-span" @click="musicListOpen = true">
                <svg t="1703842288296" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5091" width="21" height="21"><path d="M409.113 95.852h-299.65c-24.82 0-44.947 20.137-44.947 44.956v299.62c0 24.82 20.127 44.957 44.947 44.957h299.65c24.79 0 44.945-20.137 44.945-44.956V140.808c0-24.82-20.156-44.956-44.945-44.956zM869.771 556.522h-299.66c-24.82 0-44.936 20.116-44.936 44.935v299.64c0 24.821 20.116 44.937 44.937 44.937h299.66c24.8 0 44.936-20.116 44.936-44.936v-299.64c0-24.82-20.137-44.936-44.937-44.936zM937.536 210.565L695.37 82.722c-20.035-10.588-44.876-2.902-55.483 17.114L512.025 342.049c-10.568 20.077-2.892 44.877 17.174 55.505l242.174 127.823c20.056 10.588 44.936 2.902 55.524-17.135L954.72 266.07c10.599-20.076 2.922-44.916-17.184-55.504zM409.113 556.522h-299.65c-24.82 0-44.947 20.116-44.947 44.935v299.64c0 24.821 20.127 44.937 44.947 44.937h299.65c24.79 0 44.945-20.116 44.945-44.936v-299.64c0-24.82-20.156-44.936-44.945-44.936z" fill="" p-id="5092"></path></svg>
            </div>
            <span class="tag-span" :class="{tagClassActive:defaultClass==999999?true:false}" @click="musicStore.getCategoryList();setDefaultClass(999999);">推荐</span>
            <span class="tag-span" :class="{tagClassActive:defaultClass==999998?true:false}" @click="musicStore.getTopList();setDefaultClass(999998);">排行榜</span>
            <span class="tag-span" v-for="(item) in musicStore.categoriesDetail.slice(0, 50)" :class="{tagClassActive:defaultClass==item.categoryId?true:false}" @click="getRadio(item.categoryId);setDefaultClass(item.categoryId);">
                {{item.categoryName}}
            </span>
        </div>
        <div class="category">
            <el-row :gutter="20">
                <div class="grid-img"  v-for="(item) in musicStore.categoriesDetailList">
                    <div class="img-cover">
                        <img v-lazy="item.imgUrl" @load="loadingImg">
                        <div class="img-mask">
                            <svg width="21" height="21" viewBox="0 0 139 139" xml:space="preserve"
                            xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <path
                            d="M117.037,61.441L36.333,14.846c-2.467-1.424-5.502-1.424-7.972,0c-2.463,1.423-3.982,4.056-3.982,6.903v93.188  c0,2.848,1.522,5.479,3.982,6.9c1.236,0.713,2.61,1.067,3.986,1.067c1.374,0,2.751-0.354,3.983-1.067l80.704-46.594  c2.466-1.422,3.984-4.054,3.984-6.9C121.023,65.497,119.502,62.866,117.037,61.441z" />
                        </svg>
                    </div>
                </div>
                    <span @click="musicStore.getMusicListDetail(item.tid, item.group, item.data); goCategoryDetail()">{{ item.title }}</span>
                </div>
            </el-row>
        </div>
        <div class="all-tag"><ALLtag class="all-tag" /></div>
    </div>
</template>

<script  lang="ts" setup>
import ALLtag from '@/components/main/music/layout/Alltag.vue';
import musicResource from "@/store/modules/musicResource";
import { provide, ref } from "vue";
import { useRouter } from 'vue-router';

let $router = useRouter();
let musicStore = musicResource();

const musicListOpen = ref(false)
const defaultClass = ref(999999)

const goCategoryDetail = () => {
    $router.push('/categoryDetail');
}

const getRadio = (id: number) => {
    musicStore.getCategoryDetailById(id);
}

const setDefaultClass = (id: number) => {
    defaultClass.value = id;
}

provide("all-tag", {
    musicListOpen,
    defaultClass,
    setDefaultClass,
    getRadio
})

const loadingImg = (event:any)=> {
    if (event.target.classList.contains('loadingImg1')) {
        event.target.classList.add('loadingImg2');
        event.target.classList.remove('loadingImg1');
        
    }else {
        event.target.classList.add('loadingImg1');
        event.target.classList.remove('loadingImg2');
    }
}
</script>

<style lang="scss" scoped>
$tag-height: 25px;
.tag {
    display: flex;
    font-size: 18px;
    overflow: hidden;
    white-space: nowrap;
    .tag-span {
        cursor: pointer;
        border-radius: 5px;
        color: var(--text-color);
        padding: 1px 7px;
        margin-left: 10px;
        line-height: $tag-height;
    }
    .tag-span:not(.tagClassActive):hover {
        background-color: var(--bg-color-hover);
    }
    .tagClassActive {
        background-color: var(--bg-color-active);
        transition: background-color 0.3s ease-in;
    }
}
.category {
    height: calc(100% - $tag-height - 10px);
    margin-top: 5px;
    margin-left: 10px;
    overflow-x: hidden;
    .grid-img {
        width: 130px;
        margin: 10px 20px;
        display: flex;
        flex-wrap: wrap;
        cursor: pointer;
        .img-cover {
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: -8px 0 5px -5px #a2a0a0;
            img {
                border-radius: 10px;
                height: 130px;
                width: 100%;
            }
            .loadingImg1 {
                animation: loadingImg1 1s forwards;
            }
            .loadingImg2 {
                animation: loadingImg2 1s ease-in-out forwards;
            }
            @keyframes loadingImg1 {
                from {
                    opacity: 0;
                    width: 0;
                    transform: translateX(-100%);
                }
                to {
                    opacity: 1;
                    width: 100%;
                    transform: translateX(0%);
                }
            }
            @keyframes loadingImg2 {
                from {
                    opacity: 0;
                    width: 0;
                    transform: translateX(-100%);
                }
                to {
                    opacity: 1;
                    width: 100%;
                    transform: translateX(0%);
                }
            }
            .img-mask {
                position: absolute;
                background-color: var(--play-mask-color);
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                visibility: hidden;
                svg {
                    fill: var(--play-mask-fill-color);
                }
            }
        }
    }
    span {
        font-size: 13px;
        width: 100%;
    }
    .grid-img:hover {
        transform: scale(1.05);
    }
    .grid-img:hover .img-mask {
        visibility: visible;
    }
    .grid-img:hover span {
        color: var(--text-color-hover);
    }
}
.category::-webkit-scrollbar {
    width: 10px;
}
.category::-webkit-scrollbar-thumb {
    background: var(--scrollbar-color);
    border-radius: 6px;
}
.all-tag {
    :deep(.el-drawer__body::-webkit-scrollbar) {
    width: 10px;
    }
    :deep(.el-drawer__body::-webkit-scrollbar-thumb) {
        background: var(--scrollbar-color);
        border-radius: 6px;
    }
}
</style>