import axios from "axios";
import qs from "qs";
import { Category, CategoryItem, CategoriesDetailItem, musicList, music } from "@/type/musicTypes";
import { formatTime, nextInt } from '@/common/utils'

enum URL {
    // 分类
    CATEGORY_LIST_URL = "https://y.qq.com/n/ryqq/category/",
    CATEGORY_DETAIL_URL = "https://u.y.qq.com/cgi-bin/musicu.fcg",
    MUSIC_LIST_DETAIL = "http://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg",
    MUSIC_IMG = "https://y.qq.com/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000"
}

// 全部分类
export const getCategoryList = async () => {
    // return { categoriesArray, categoriesDetail, playList };
};

// 分类详情
export const getCategoryDetailById = async (id: number) => {
    // return { topList };
}

export const getMusicListDetail = async (id: number, group: string, data: any) => {
    // return { musicListDetail };
}

export const getSongDetail = async (music: music) => {
    // return { playUrl }
}