import { defineStore } from "pinia";
import { routes } from "@/router/modules/musicRouters";
import { Category, CategoryItem, musicList, CategoriesDetail } from "@/type/musicTypes";
import { getClassName } from "@/common/importModule";

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
            const method = await getClassName(this.currentPlat.file, "getCategoryList");
            const result = await method!();
            this.categories = result!.categoriesArray;
            this.categoriesDetail = result!.categoriesDetail;
        },
        // 获取分类详细展示
        async getCategoryDetailById(id: number|string, page: number) {
            const method = await getClassName(this.currentPlat.file, "getCategoryDetailById");
            const result = await method!(id, page);
            this.categoriesDetailList = result!.categoriesDetail;
        },
        // 详细歌单
        async getMusicListDetail(id: number|string, group: string, data: any) {
            const method = await getClassName(this.currentPlat.file, "getMusicListDetail");
            const result = await method!(id, group, data);
            this.musicListDetail = result!.musicListDetail;
        }
    },
    getters: {
        
    }
});

export default menuStore;
