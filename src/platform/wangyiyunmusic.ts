import axios from "axios";
import qs from "qs";
import { Category, CategoryItem, CategoriesDetailItem, musicList, music, CategoriesDetail } from "@/type/musicTypes";
import { formatTime, nextInt } from '@/common/utils'

enum URL {
    BASE_URL = "https://music.163.com",
    CATEGORY_LIST_URL = "https://music.163.com/discover/playlist",
    CATEGORY_DETAIL_URL = "https://music.163.com/discover/playlist?cat=${cate}&order=hot&limit=${limit}&offset=${offset}",
    MUSIC_LIST_DETAIL = "",
    MUSIC_IMG = ""
}

// 全部分类
export const getCategoryList = async () => {
    const a = await axios.get(URL.CATEGORY_LIST_URL);
    const parser = new DOMParser();
    const doc = parser.parseFromString(a.data, "text/html");
    const categoryList = doc.body.querySelectorAll("#cateListBox .f-cb")
    let categoriesArray: Array<Category> = [];
    let categoriesDetail: Array<CategoryItem> = [];
    categoryList.forEach((el, index) => {
        let categories: Array<CategoryItem> = [];
        const dt = el.querySelector("dt")?.textContent;
        el.querySelectorAll(".s-fc1 ")?.forEach((dd) => {
            const categoryItem: CategoryItem = {
                categoryName: dd.textContent||'',
                categoryId: dd.textContent||'',
            }
            categories.push(categoryItem);
            categoriesDetail.push(categoryItem);
        });
        categoriesArray.push({
            categoryGroupName: dt||'',
            groupId: index,
            items: categories,
        })
    });
    let items = [
        {
            categoryId: "全部",
            categoryName: "推荐",
            default: true
        },
        {
            categoryId: "排行榜",
            categoryName: "排行榜",
        }
    ]
    // 推荐, 排行榜
    let recommended = {
        groupId: -1,
        categoryGroupName: "精选",
        items
    };
    categoriesDetail.unshift(...items);
    categoriesArray.unshift(recommended)
    return { categoriesArray, categoriesDetail };
};

// 分类详情
export const getCategoryDetailById = async (id: number|string, page: number) => {
    console.log(id, page);
    const reqBody = {
        cat: id,
        order: "hot",
        limit: 35,
        offset: (page - 1) * 35,
    };
    const a = await axios.get(URL.CATEGORY_LIST_URL + "?" + qs.stringify(reqBody));
    const parser = new DOMParser();
    const doc = parser.parseFromString(a.data, "text/html");
    let categoriesDetailItem: Array<CategoriesDetailItem> = [];
    doc.body.querySelectorAll("#m-pl-container li")?.forEach((li) => {
        categoriesDetailItem.push({
            imgUrl: li.querySelector(".u-cover img")?.getAttribute('src')||'',
            title: li.querySelector(".dec a")?.textContent||'',
            tid: li.querySelector(".dec a")?.getAttribute('href')||'',
            group: "",
        })
    })
    const pgEls = doc.querySelectorAll("#m-pl-pager .u-page .zpgi");
    let categoriesDetail: CategoriesDetail = {
        categoriesDetailItem,
    };
    if (pgEls && pgEls.length > 0) {
        const totalEl = Number(pgEls[pgEls.length - 1].textContent);
        categoriesDetail.page = {
            size: 35,   // 每页大小
            totalPage: totalEl,  // 总页数
        }
    }
    return { categoriesDetail };
}

export const getMusicListDetail = async (id: number, group: string, data: any) => {
    // return { musicListDetail };
}

export const getSongDetail = async (music: music) => {
    // return { playUrl }
}