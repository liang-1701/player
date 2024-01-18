import { defineStore } from "pinia";
import { routes } from "@/router/modules/musicRouters";
import { Category, CategoryItem, musicList, CategoriesDetail } from "@/type/musicTypes";
import { importAndExtract } from "@/common/importModule";

let menuStore = defineStore("menu", {
    state: () => {
        return {
            menus: routes.find(item => item.name=='music')?.children.filter(item => item.show)[0],
            currentPlat: {} as any,
            categories:Array<Category>(),  // 所有分类
            categoriesDetail: Array<CategoryItem>(),  // 详细类别
            categoriesDetailList: {} as CategoriesDetail,  // 分类详细展示
            musicListDetail: <musicList>{},  // 详细歌单
        };
    },
    actions: {
        // 切换平台
        async setCurrentPlat(plat: any) {
            this.currentPlat = plat;
            await this.getCategoryList();
        },
        async getCategoryList() {
            const method = await importAndExtract(`/src/platform/${this.currentPlat.file}`, 'getCategoryList');
            const result = await method();
            this.categories = result!.categoriesArray;
            this.categoriesDetail = result!.categoriesDetail;
        },
        // 获取分类详细展示
        getCategoryDetailById(id: number|string, page: number) {
            importAndExtract(`/src/platform/${this.currentPlat.file}`, 'getCategoryDetailById').then((menthod) => {
                return menthod(id, page);
            }).then((result) => {
                this.categoriesDetailList = result!.categoriesDetail;
            })
        },
        // 详细歌单
        getMusicListDetail(id: number|string, group: string, data: any) {
            importAndExtract(`/src/platform/${this.currentPlat.file}`, 'getMusicListDetail').then((menthod) => {
                return menthod(id, group, data);
            }).then((result) => {
                this.musicListDetail = result!.musicListDetail;
                console.log("音乐列表");
                console.log(this.musicListDetail);
            })
        }
    },
    getters: {
        
    }
});

export default menuStore;
