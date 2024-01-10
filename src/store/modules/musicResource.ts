import { defineStore } from "pinia";
import { routes } from "@/router/modules/musicRouters";
import { getQQCategoryList, getQQCategoryDetailById, getQQTopList, getMusicListDetail } from "@/platform/qq";
import { Category, CategoryItem, CategoriesDetailItem, musicList } from "@/type/musicTypes";

let menuStore = defineStore("menu", {
    state: () => {
        return {
            menus: routes.filter(item => item.name=="music")[0],
            defaultId: {},
            categories:Array<Category>(),  // 所有分类
            categoriesDetail: Array<CategoryItem>(),  // 详细类别
            categoriesDetailList: Array<CategoriesDetailItem>(),  // 分类详细展示
            musicListDetail: <musicList>{},  // 详细歌单
        };
    },
    actions: {
        // 设置默认平台
        init () {
            this.defaultId = this.menus.children.filter(item => item.meta.default)[0];
            this.getCategoryList();
        },
        // 切换平台
        setDefaultMenu(path: string) {
            this.defaultId = this.menus.children.filter(item => item.meta.type=="platform").filter(item => item.path==path)[0];
        },
        getCategoryList() {
            getQQCategoryList().then((result) => {
                this.categories = result!.categoriesArray;
                this.categoriesDetail = result!.categoriesDetail;
                this.categoriesDetailList = result!.playList;
            })
        },
        // 获取分类详细展示
        getCategoryDetailById(id: number) {
            getQQCategoryDetailById(id).then((result) => {
                this.categoriesDetailList = result!.categoriesDetail;
            })
        },
        // 排行榜
        getTopList() {
            getQQTopList().then((result) =>{
                this.categoriesDetailList = result!.topList;
            });
        },
        // 详细歌单
        getMusicListDetail(id: number, group: string, data: any) {
            getMusicListDetail(id, group, data).then((result) => {
                this.musicListDetail = result!.musicListDetail;
            });
        }
    },
    getters: {

    }
});

export default menuStore;
