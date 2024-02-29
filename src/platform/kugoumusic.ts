import axios from "axios";
import qs from "qs";
import { Category, CategoryItem, CategoriesDetailItem, musicList, music, CategoriesDetail } from "@/type/musicTypes";
import { formatTime, randomText, toTrimString } from '@/common/utils'
import CryptoJS from 'crypto-js';
import forge from "node-forge";
import { random } from "lodash";
import { da } from "element-plus/es/locales.mjs";

enum URL {
    BASE_URL = "http://mac.kugou.com",
    // 分类
    CATEGORY_LIST_URL = "http://mac.kugou.com/v2/musicol/yueku/v1/special/index/getData/getData.html&cdn=cdn&t=5&c=",
    TOP_LIST_URL = "https://www.kugou.com/yy/html/rank.html",
    MUSIC_LIST_DETAIL = "https://www.kugou.com/yy/special/single/${id}.html",
    MUSIC_URL = "https://wwwapi.kugou.com/play/songinfo"
}

// 全部分类
export const getCategoryList = async () => {
    const a = await axios.get(URL.CATEGORY_LIST_URL);
    const parser = new DOMParser();
    const doc = parser.parseFromString(a.data, "text/html");
    const categoryList = doc.body.querySelectorAll(".pc_specail_menu")
    let categoriesArray: Array<Category> = [];
    let categoriesDetail: Array<CategoryItem> = [];
    let items = [
        {
            categoryId: "排行榜",
            categoryName: "排行榜",
            default: false,
        }
    ]
    categoryList.forEach((el, index) => {
        let categories: Array<CategoryItem> = [];
        const dt = el.querySelector("h3")?.textContent;
        if("默认" == dt) {
            items.unshift({
                categoryId: el.querySelectorAll(".pc_specail_menu_content a")[0].getAttribute('href')?.split("jumpTo('")[1].split("'")[0]||'',
                categoryName: "推荐",
                default: true
            });
            return;
        }
        el.querySelectorAll(".pc_specail_menu_content a")?.forEach((dd) => {
            const categoryItem: CategoryItem = {
                categoryName: dd.textContent||'',
                categoryId: dd.getAttribute("href")?.split("jumpTo('")[1].split("'")[0]||'',
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
    if("排行榜" == id) return { categoriesDetail: (await getTopList()).categoriesDetail }
    const a = await axios.get(URL.BASE_URL + id + `&p=${page}&pagesize=20`);
    const parser = new DOMParser();
    const doc = parser.parseFromString(a.data, "text/html");
    const script = doc.body.querySelectorAll("script");
    let globalData = [] as any;
    script.forEach(s => {
        if(s?.textContent?.includes("global.special =")) {
            globalData = Function(s.textContent + ' return global')();
        }
    })
    let categoriesDetailItem: Array<CategoriesDetailItem> = [];
    globalData.special.forEach((cate: { img: any; specialname: any; specialid: any; }) => {
        categoriesDetailItem.push({
            imgUrl: cate.img,
            title: cate.specialname,
            tid: cate.specialid,
            group: "other",
        })
    })
    let categoriesDetail: CategoriesDetail = {
        categoriesDetailItem,
        page: {
            total: Number(globalData.total),
            size: Number(globalData.pagesize)
        }
    };
    return { categoriesDetail };
}

export const getTopList = async () => {
    const a = await axios.get(URL.TOP_LIST_URL);
    const parser = new DOMParser();
    const doc = parser.parseFromString(a.data, "text/html");
    const categoryList = doc.body.querySelectorAll(".pc_temp_side li")
    let categoriesDetailItem: Array<CategoriesDetailItem> = [];
    categoryList.forEach(li => {
        categoriesDetailItem.push({
            imgUrl: li.querySelector("span")?.getAttribute("style")?.split('(')[1].split(')')[0]||"",
            title: li.querySelector("a")?.getAttribute("title")||"",
            tid: li.querySelector("a")?.getAttribute("href")||"",
            group: "top",
            data: {
                imgUrl: li.querySelector("span")?.getAttribute("style")?.split('(')[1].split(')')[0]||"",
                title: li.querySelector("a")?.getAttribute("title")||"",
                tid: li.querySelector("a")?.getAttribute("href")||"",
            }
        })
    })
    let categoriesDetail: CategoriesDetail = {
        categoriesDetailItem
    };
    return { categoriesDetail };
}

export const getMusicListDetail = async (id:string, group: string, data: any) => {
    if("top" == group) {
        const a = await axios.get(id);
        const parser = new DOMParser();
        const doc = parser.parseFromString(a.data, "text/html");
        const songlist = doc.body.querySelectorAll("#rankWrap .pc_temp_songlist li");
        let songList: Array<music> = []
        songlist.forEach(li => {
            const a = li.querySelector("a");
            songList.push({
                mid: li.getAttribute("data-eid")||'',
                name: a?.getAttribute("title")?.split("-")[1].trim()||"",
                time: li.querySelector(".pc_temp_time")?.textContent?.trim()||"",
                img: '',
                album: {
                    mid: "",
                    name: "",
                },
                singer: [{mid:"", name: a?.getAttribute("title")?.split("-")[0].trim()||""}],
                data: { chl: 2, html: a?.getAttribute("href") }
            })
        })
        let musicListDetail: musicList = {
            tid: data?.tid||"",
            title: data?.title||"",
            img: data?.imgUrl||"",
            desc: "",
            list: songList
        };
        return { musicListDetail };
    }else {
        const a = await axios.get(URL.MUSIC_LIST_DETAIL.replace("${id}", id));
        const parser = new DOMParser();
        const doc = parser.parseFromString(a.data, "text/html");
        const script = doc.querySelectorAll("script");
        let globalData = {} as any;
        script.forEach(s => {
            if(s?.textContent?.includes("specialInfo")) {
                globalData = Function(s.textContent + ' return [data, specialInfo]')();
            }
        })
        let songList: Array<music> = []
        globalData[0].forEach((item: any) => {
            songList.push({
                mid: item.encode_album_audio_id, // album_audio_id
                name: item.songname,
                time: formatTime(item.duration / 1000),
                img: "",
                album: {
                    mid: item.album_id,
                    name: item.album_name,
                },
                singer: item.authors.map((s: { author_id: any, author_name: any; }) => ({mid: s.author_id, name: s.author_name})),
                data: { chl: 2, html: item.song_url }
            })
        })
        let musicListDetail: musicList = {
            tid: globalData[1]?.id||"",
            title: globalData[1]?.class_name||"",
            img: globalData[1]?.image||"",
            desc: globalData[1]?.intro,
            list: songList
        };
        return { musicListDetail };
    }
}

export const getSongDetail = async (music: music) => {
    const reqBody:Record<string, any> = {
        srcappid: 2919,
        clientver: 20000,
        clienttime: new Date().getTime(),
        mid: 'caaca808a19636095e2c88dc39577a12',
        uuid: 'caaca808a19636095e2c88dc39577a12',
        dfid: '0jI0v83wGKCQ2PXgTX14074K',
        appid: 1014,
        platid: 4,
        encode_album_audio_id: music.mid,
        token: '',
        userid: 0
    }
    var sortedObj = Object.fromEntries(
        Object.entries(reqBody).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      );
    let s = jsonToKeyValueArray(sortedObj);
    s.push('NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt');
    s.unshift("NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt");
    const sign = CryptoJS.MD5(s.join('')).toString();
    reqBody['signature'] =  sign;
    const res = await axios.get(URL.MUSIC_URL + "?" + qs.stringify(reqBody));
    music.img = res.data.data.img;
    const playUrl = res.data.data.play_url;
    return { playUrl }
}


function jsonToKeyValueArray(json:any) {
    let keyValuePairs = [];
    for (let key in json) {
      if (json.hasOwnProperty(key)) {
        keyValuePairs.push(`${key}=${json[key]}`);
      }
    }
    return keyValuePairs;
}
  