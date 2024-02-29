import { defineStore } from "pinia";
import { routes } from "@/router/modules/musicRouters";
import { Category, CategoryItem, Square, SquareDetail } from "@/type/musicTypes";
import { getClassName } from "@/common/importModule";

let menuStore = defineStore("menu", {
    state: () => {
        return {
            menus: routes.find(item => item.name=='music')?.children.filter(item => item.show)[0],
            currentPlat: {} as any,
            categories:Array<Category>(),  // 所有分类
            categoriesDetail: Array<CategoryItem>(),  // 详细类别
            square: {} as Square,  // 歌单广场
            squareDetail: {} as SquareDetail,  // 歌单内容
        };
    },
    actions: {
        // 切换平台
        async setCurrentPlat(plat: any) {
            this.currentPlat = plat;
            await this.getCategory();
        },
        async getCategory() {
            const method = await getClassName(this.currentPlat.file, "getCategory");
            const result = await method!();
            this.categories = result!.categories;
            this.categoriesDetail = result!.categoriesDetail;
        },
        // 获取分类详细展示
        async getSquare(id: number|string, page: number) {
            const method = await getClassName(this.currentPlat.file, "getSquare");
            const result = await method!(id, page);
            this.square = result!.square;
        },
        // 详细歌单
        async getSquareDetail(id: number|string, group: string, data: any) {
            const method = await getClassName(this.currentPlat.file, "getSquareDetail");
            const result = await method!(id, group, data);
            this.squareDetail = result!.squareDetail;
        }
    },
    getters: {
        
    }
});

export default menuStore;
