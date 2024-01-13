import { defineStore } from "pinia";
import { routes } from "@/router/modules/musicRouters";
import { Category, CategoryItem, CategoriesDetailItem, musicList } from "@/type/musicTypes";
import { importAndExtract } from "@/common/importModule";

let menuStore = defineStore("menu", {
    state: () => {
        return {
            menus: routes.find(item => item.name=='music')?.children.filter(item => item.show)[0],
            currentPlat: {} as any,
            categories:Array<Category>(),  // 所有分类
            categoriesDetail: Array<CategoryItem>(),  // 详细类别
            categoriesDetailList: Array<CategoriesDetailItem>(),  // 分类详细展示
            musicListDetail: <musicList>{},  // 详细歌单
        };
    },
    actions: {
        // 切换平台
        setCurrentPlat(plat: any) {
            this.currentPlat = plat;
            this.getCategoryList();
        },
        getCategoryList() {
            importAndExtract(`/src/platform/${this.currentPlat.file}`, 'getCategoryList').then((menthod) => {
                return menthod();
            }).then((result) => {
                this.categories = result!.categoriesArray;
                this.categoriesDetail = result!.categoriesDetail;
                this.categoriesDetailList = result!.playList;
            })
        },
        // 获取分类详细展示
        getCategoryDetailById(id: number) {
            importAndExtract(`/src/platform/${this.currentPlat.file}`, 'getCategoryDetailById').then((menthod) => {
                return menthod(id);
            }).then((result) => {
                this.categoriesDetailList = result!.categoriesDetail;
            })
        },
        // 详细歌单
        getMusicListDetail(id: number, group: string, data: any) {
            importAndExtract(`/src/platform/${this.currentPlat.file}`, 'getMusicListDetail').then((menthod) => {
                return menthod(id, group, data);
            }).then((result) => {
                this.musicListDetail = result!.musicListDetail;
            })
        }
    },
    getters: {
        
    }
});

export default menuStore;
