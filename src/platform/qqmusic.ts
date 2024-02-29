import axios from "axios";
import qs from "qs";
import { Category, CategoryItem, CategoriesDetailItem, musicList, music, CategoriesDetail } from "@/type/musicTypes";
import { formatTime, nextInt } from '@/common/utils'

enum URL {
    // 分类
    CATEGORY_LIST_URL = "https://y.qq.com/n/ryqq/category/",
    CATEGORY_DETAIL_URL = "https://u.y.qq.com/cgi-bin/musicu.fcg",
    MUSIC_LIST_DETAIL = "http://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg",
    MUSIC_IMG = "https://y.qq.com/music/photo_new/T002R300x300M000${albummid}.jpg?max_age=2592000"
}

// 推荐歌单
let playList: CategoriesDetail = {
    categoriesDetailItem: []
};

// 全部分类
export const getCategoryList = async () => {
    let a = await axios.get(URL.CATEGORY_LIST_URL);
    const parser = new DOMParser();
    const doc = parser.parseFromString(a.data, "text/html");
    const script = doc.body.querySelector("script");
    const scriptText = script!.textContent;
    const key1 = "window.__INITIAL_DATA__ =";
    const categoryAll = scriptText!.split(key1)[1];
    const categoryJson = JSON.parse(categoryAll);
    let categoriesArray: Array<Category> = [];
    let categoriesDetail: Array<CategoryItem> = [];
    let newArray: any = [];
    // 推荐, 排行榜
    let recommended = {
        groupId: -1,
        categoryGroupName: "精选",
        items: [
            {
                categoryId: 999999,
                categoryName: "推荐",
                default: true
            },
            {
                categoryId: 999998,
                categoryName: "排行榜",
            }
        ]
    };
    categoryJson.categories.unshift(recommended)
    categoryJson.categories.forEach((item: any) => {
        if (!newArray.includes(item.groupId)) {
            newArray.push(item.groupId);
            let itemNew = removeDuplicate(item);
            categoriesDetail.push(...itemNew.items);
            categoriesArray.push(itemNew);
        }
    });
    categoryJson.playlist.forEach((item: any) => {
        playList.categoriesDetailItem.push({
            imgUrl: item.imgurl,
            title: item.dissname,
            tid: item.dissid,
            group: "other"
        })
    })
    return { categoriesArray, categoriesDetail };
};

const removeDuplicate = (item: any) => {
    let unique_array = item.items;
    for (let i = 0; i < unique_array.length; i++) {
        if (unique_array[i].categoryName === "AI歌单") {
            unique_array.splice(i, 1);
            i--;
        }
    }
    return item;
}

// 分类详情
export const getCategoryDetailById = async (id: number|string, page: number) => {
    if(999999 == id) return { categoriesDetail: playList };
    if(999998 == id) return { categoriesDetail: (await getTopList()).topList };
    const reqBody = JSON.stringify({
        req_1: {
            module: "playlist.PlayListCategoryServer",
            method: "get_category_content",
            param: {
                caller: "0",
                category_id: id,
                page: (page - 1),
                use_page: 1,
                size: 35
            }
        }
    });
    const response = await axios.post(URL.CATEGORY_DETAIL_URL, reqBody);
    const categoriesDetailItem:Array<CategoriesDetailItem> = []
    response.data.req_1.data.content.v_item.forEach((item: any) => {
        categoriesDetailItem.push({
            imgUrl: item.basic.cover.default_url,
            title: item.basic.title,
            tid: item.basic.tid,
            group: "other",
        });
    });
    let categoriesDetail: CategoriesDetail = {
        categoriesDetailItem,
        page: {
            total: response.data.req_1.data.content.total_cnt,
            size: 35
        }
    };
    return {categoriesDetail};
};
    
// 排行榜
export const getTopList = async () => {
    const reqBody = {
        _: Date.now(),
        uin: 0,
        format: 'json',
        inCharset: "utf8",
        outCharset: "utf8",
        notice: 0,
        platform: "yqq.json",
        needNewCode: 1,
        g_tk: 5381,
        data: JSON.stringify({
            comm: {
                ct: 24,
                cv: 0
            },
            req_1: {
                module: "musicToplist.ToplistInfoServer",
                method: "GetAll",
                param: {}
            }
        })
    };
    const response = await axios.get(URL.CATEGORY_DETAIL_URL + "?" + qs.stringify(reqBody));
    let topList: CategoriesDetail = {
        categoriesDetailItem: []
    };
    response.data.req_1.data.group.forEach((item: any) => {
        item.toplist.forEach((i: any) => {
            topList.categoriesDetailItem.push({
                imgUrl: i.frontPicUrl,
                title: i.title,
                tid: i.topId,
                group: "top",
                data: {
                    "period": i.period,
                }
            })
        })
    });
    return { topList };
}

export const getMusicListDetail = async (id: number|string, group: string, data: any) => {
    if(group == "top") {
        // 排行榜
        const reqBody = {
            g_tk: 5381,
            data: JSON.stringify({
                comm: {
                    ct: 24,
                    cv: 0
                },
                req_1: {
                    module: "musicToplist.ToplistInfoServer",
                    method: "GetDetail",
                    param: {
                        "topid": id, 
                        "offset": 0, 
                        "num": 100, 
                        "period": data.period
                    }
                }
            })
        }
        const response = await axios.get(URL.CATEGORY_DETAIL_URL + "?" + qs.stringify(reqBody));
        let songList: Array<music> = []
        response.data.req_1.data.songInfoList.forEach((item: any) => {
            songList.push({
                mid: item.mid,
                name: item.name,
                time: formatTime(item.interval),
                img: URL.MUSIC_IMG.replace("${albummid}", item.album.mid),
                album: {
                    mid: item.album.mid,
                    name: item.album.name,
                },
                singer: item.singer.map((s: { mid: any, name: any; }) => ({mid: s.mid, name: s.name})),
                data: { chl: 3 }
            })
        })
        let topData = response.data.req_1.data.data;
        let musicListDetail: musicList = {
            tid: topData.topId,
            title: topData.title,
            img: topData.frontPicUrl || topData.headPicUrl,
            desc: topData.intro,
            updateTime: topData.updateTime,
            list: songList
        };
        return { musicListDetail };
    }else {
        const reqBody = {
            format: 'json',
            type: 1,
            utf8: 1,
            disstid: id,  // 歌单的id
            loginUin: 0,
        }
        const response = await axios.get(URL.MUSIC_LIST_DETAIL + "?" + qs.stringify(reqBody));
        const cdlist = response.data.cdlist[0];
        let songList: Array<music> = []
        cdlist.songlist.forEach((item: any) => {
            songList.push({
                mid: item.songmid,
                name: item.songname,
                time: formatTime(item.interval),
                img: URL.MUSIC_IMG.replace("${albummid}", item.albummid),
                album: {
                    mid: item.albummid,
                    name: item.albumname,
                },
                singer: item.singer.map((s: { mid: any, name: any; }) => ({mid: s.mid, name: s.name})),
                data: { chl: 3 }
            })
        })
        let musicListDetail: musicList = {
            tid: cdlist.disstid,
            title: cdlist.dissname,
            img: cdlist.logo,
            desc: cdlist.desc,
            list: songList
        };
        return { musicListDetail };
    }
}

export const getSongDetail = async (music: music) => {
    const reqBody = {
        format: 'json',
        data: JSON.stringify({
            req_1: {
                module: "music.pf_song_detail_svr",
                method: "get_song_detail_yqq",
                param: {
                    "song_mid": music.mid
                }
            }
        })
    }
    const response = await axios.get(URL.CATEGORY_DETAIL_URL + "?" + qs.stringify(reqBody));
    const types = [{prefix: 'M800',ext: '.mp3',}, {prefix: 'M500',ext: '.mp3',}, {prefix: 'C400',ext: '.m4a'}]
    let playUrl = "";
    for (let index = 0; index < types.length; index++) {
        const item = types[index];
        const reqBody2 = {
            '-': 'getplaysongvkey',
            'g_tk': 5381,
            loginUin: 0,
            hostUin: 0,
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf8',
            notice: 1,
            platform: 'yqq.json',
            needNewCode: 0,
            data: JSON.stringify({
                    comm: {
                        uin: "0",
                        format: "json",
                        ct: 24,
                        cv: 0
                    },
                    req_1: {
                        module: "vkey.GetVkeyServer",
                        method: "CgiGetVkey",
                        param: {
                            filename: [`${item.prefix}${response.data.req_1.data.track_info.mid}${response.data.req_1.data.track_info.mid}${item.ext}`],
                            guid: nextInt(10000000).toFixed(0),
                            songmid: [response.data.req_1.data.track_info.mid],
                            songtype: [response.data.req_1.data.track_info.type],
                            uin: "0",
                            loginflag: 1,
                            platform: "20"
                        }
                    }
                })
        }
        const response2 = await axios.get(URL.CATEGORY_DETAIL_URL + "?" + qs.stringify(reqBody2));
        const sip = response2.data.req_1.data.sip[0];
        const purl = response2.data.req_1.data.midurlinfo[0].purl;
        if (sip && purl) {
            playUrl = `${sip}${purl}`;
            break;
        }
    }
    return { playUrl }
}