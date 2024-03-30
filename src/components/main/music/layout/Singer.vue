<template>
    <div class="container-singer">
        <div class="categories">
            <div class="category" v-for="(value, key) in musicStore.singerSquare.categories">
                <span class="cate" v-for="item in value" :class="{active:item.id==current[key]}" @click="getSingersByTypes(key, item)">
                    {{ item.name }}
                </span>
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
            <div class="loader"></div>
        </div>
    </div>
</template>

<script  lang="ts" setup>
import { Play } from '@icon-park/vue-next'
import musicResource from "@/store/modules/musicResource";
import { inject, onMounted, reactive, ref, onUnmounted, onActivated } from "vue";

let musicStore = musicResource();
const musicEnevt:any = inject("music-enevt");
const current: Record<string, any> = reactive({});
const page = ref(1);
const singersCount = ref(0);

const getSingersByTypes = async (key:any, val:any) => {
    current[key] = val.id;
    page.value = 1;
    musicStore.getSingersByTypes(current, page.value);
}

const ob = new IntersectionObserver(async (entries) => {
    if(entries[0].isIntersecting) {
        page.value += 1;
        await musicStore.getSingersByTypes(current, page.value);
        singersCount.value = musicStore.singers.length;
    }
}, 
{
    root: null,
    threshold: 0.1
}
)

onMounted(async () => {
    await musicStore.getAllSingers();
    Object.entries(musicStore.singerSquare.categories).forEach(([key, value]) => {
        current[key] = value.find((item:any) => item.default)?.id;
    });
    ob.observe(document.querySelector(".loader") as HTMLElement);
})

onUnmounted(() => {
    ob.disconnect();
})

onActivated(async () => {
    await musicStore.getAllSingers();
    page.value = 1;
    if(musicStore.singerSquare.categories) {
        Object.entries(musicStore.singerSquare.categories).forEach(([key, value]) => {
            current[key] = value.find((item:any) => item.default)?.id;
        });
    }
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