import { defineStore } from "pinia";
import { routes } from "@/router/modules/musicRouters";
import { Category, CategoryItem, Square, SquareDetail, SingerDetail, Singer, Album, SingerSquare } from "@/type/musicTypes";
import { getClassName } from "@/common/importModule";

let menuStore = defineStore("menu", {
    state: () => {
        return {
            menus: routes.find(item => item.name=='music')?.children.filter(item => item.show)[0],
            currentPlat: {} as any,
            currSearchPlat: {} as any,
            categories:Array<Category>(),  // 所有分类
            categoriesDetail: Array<CategoryItem>(),  // 详细类别
            square: {} as Square,  // 歌单广场
            squareDetail: {} as SquareDetail,  // 歌单内容
            singerDetail: {} as SingerDetail, // 歌手详细
            albumDetail: {} as Album, // 歌手详细
            singerSquare : {} as SingerSquare, // 歌手广场
            singers: Array<Singer>(), // 所有歌手
            search: {} as any, // 搜索内容
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
        },
        // 歌手详情
        async getSingerDetail(singer: Singer, page: number) {
            const plat = this.menus!.meta.platform!.find((item:any) => item.id == singer.chl);
            const method = await getClassName(plat!.file, "getSingerDetail");
            const result = await method!(singer, page);
            if (page === 1) {
                this.singerDetail = result.singerDetail;
            }else {
                this.singerDetail.recommend?.push(...result.singerDetail.recommend);
            }
        },
        // 通过歌手获得歌曲
        async getSongsBySinger(singer: Singer, page: number) {
            const plat = this.menus!.meta.platform!.find((item:any) => item.id == singer.chl);
            const method = await getClassName(plat!.file, "getSongsBySinger");
            const result = await method!(singer, page);
            if (page === 1) {
                this.singerDetail.songs = result.songs;
            }else {
                this.singerDetail.songs?.push(...result.songs);
            }
        },
        // 通过歌手获得专辑
        async getAlbumsBySinger(singer: Singer, page: number) {
            const plat = this.menus!.meta.platform!.find((item:any) => item.id == singer.chl);
            const method = await getClassName(plat!.file, "getAlbumsBySinger");
            const result = await method!(singer, page);
            if (page === 1) {
                this.singerDetail.albums = result.albums;
            }else {
                this.singerDetail.albums?.push(...result.albums);
            }
        },
        // 专辑详情
        async getAlbumDetail(album: Album) {
            const plat = this.menus!.meta.platform!.find((item:any) => item.id == album.chl);
            const method = await getClassName(plat!.file, "getAlbumDetail");
            const result = await method!(album);
            this.albumDetail = result.albumDetail;
        },
        // 所有歌手
        async getAllSingers() {
            const method = await getClassName(this.currentPlat.file, "getAllSingers");
            const result = await method!();
            this.singerSquare = result.singerSquare;
            this.singers = result.singers;
        },
        // 查询歌手
        async getSingersByTypes(data:any, page:number) {
            const method = await getClassName(this.currentPlat.file, "getSingersByTypes");
            const result = await method!(data, page);
            if (page === 1) {
                this.singers = result.singers;
            }else {
                this.singers.push(...result.singers);
            }
        },
        // 搜索歌曲
        async searchSongs(keywords: string, page: number) {
            const method = await getClassName(this.currSearchPlat.file, "searchSongs");
            const result = await method!(keywords, page);
            this.search.keywords = keywords;
            if (page === 1) {
                this.search.songs = result.songs;
            }else {
                this.search.songs?.push(...result.songs);
            }
        },
        // 搜索歌单
        async searchSpecials(keywords: string, page: number) {
            const method = await getClassName(this.currSearchPlat.file, "searchSpecials");
            const result = await method!(keywords, page);
            this.search.keywords = keywords;
            if (page === 1) {
                this.search.specials = result.specials;
            }else {
                this.search.specials?.push(...result.specials);
            }
        },
        // 搜索歌手
        async searchSingers(keywords: string, page: number) {
            const method = await getClassName(this.currSearchPlat.file, "searchSingers");
            const result = await method!(keywords, page);
            this.search.keywords = keywords;
            if (page === 1) {
                this.search.singers = result.singers;
            }else {
                this.search.singers?.push(...result.singers);
            }
        },
        // 搜索专辑
        async searchAlbums(keywords: string, page: number) {
            const method = await getClassName(this.currSearchPlat.file, "searchAlbums");
            const result = await method!(keywords, page);
            this.search.keywords = keywords;
            if (page === 1) {
                this.search.albums = result.albums;
            }else {
                this.search.albums?.push(...result.albums);
            }
        },
    },
    getters: {
        
    }
});

export default menuStore;
