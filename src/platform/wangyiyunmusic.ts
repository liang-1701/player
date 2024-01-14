import axios from "axios";
import qs from "qs";
import { Category, CategoryItem, CategoriesDetailItem, musicList, music } from "@/type/musicTypes";
import { formatTime, nextInt } from '@/common/utils'

enum URL {
    BASE_URL = "https://music.163.com",
    CATEGORY_LIST_URL = "https://music.163.com/discover/playlist",
    CATEGORY_DETAIL_URL = "",
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
    let i = 0
    categoryList.forEach((el, index) => {
        let categories: Array<CategoryItem> = [];
        const dt = el.querySelector("dt")?.textContent;
        el.querySelectorAll(".s-fc1 ")?.forEach((dd) => {
            const categoryItem: CategoryItem = {
                categoryName: dd.textContent||'',
                categoryId: i++,
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
    
    return { categoriesArray, categoriesDetail };
};

// 分类详情
export const getCategoryDetailById = async (id: number|string) => {
    const a = await axios.get(URL.CATEGORY_LIST_URL);
    const parser = new DOMParser();
    const doc = parser.parseFromString(a.data, "text/html");
    let categoriesDetail: Array<CategoriesDetailItem> = [];
    doc.body.querySelectorAll("#m-pl-container li")?.forEach((li) => {
        categoriesDetail.push({
            imgUrl: li.querySelector(".u-cover img")?.getAttribute('src')||'',
            title: li.querySelector(".dec a")?.textContent||'',
            tid: li.querySelector(".dec a")?.getAttribute('href')||'',
            group: "",
        })
    })
    console.log(categoriesDetail);
    return { categoriesDetail };
}

export const getMusicListDetail = async (id: number, group: string, data: any) => {
    // return { musicListDetail };
}

export const getSongDetail = async (music: music) => {
    // return { playUrl }
}