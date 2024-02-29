import axios from "axios";
import { Category, CategoryItem, Square, SquareItem, SquareDetail, Song } from "@/type/musicTypes";
import { formatTime } from '@/common/utils'
import CryptoJS from 'crypto-js';
import { post, get } from "@/common/http";

const KEY = 'NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt';

export class KuGouMusicApi {

    // 全部分类
    static getCategory = async () => {
        let categories: Array<Category> = [];
        let categoriesDetail: Array<CategoryItem> = [];
        const url = 'http://gateway3.kugou.com/pubsongs/v1/get_tags_by_type';
        const data = {"tag_type":"collection","tag_id":0,"is_publish":1,"source":3,"is_show":0};
        const params =  {
            'appid': '1001',
            'clientver': '10246',
            'clienttime': '1706790658545',
            'mid': 'd8de2ff0a89da0a2528dc85e66beff07',
            'uuid': '9CC9497A36723AD48C86D6FFE0A97506',
            'dfid': '1nhI9M0MVRfK2uTtUl4EF7yN',
            'signature': '19a9dd8c692db28479854841516c88de'
        } 
        const res = await post(url, data, params);
        (res as any).data.forEach((item: any) => {
            const items: Array<CategoryItem> = [];
            item.son.forEach((el:any) => {
                const categoryItem = {
                    categoryName: el.tag_name,
                    categoryId: el.tag_id,
                }
                categoriesDetail.push(categoryItem);
                items.push(categoryItem);
            });
            categories.push({
                groupId: item.tag_id,
                name: item.tag_name,
                categoryItems: items
            })
        });
        let others = [
            {
                categoryId: 0,
                categoryName: "推荐",
                default: true,
            },
            {
                categoryId: "top",
                categoryName: "排行榜",
            }
        ]
        categories.unshift({
            groupId: -1,
            name: "精选",
            categoryItems: others
        });
        categoriesDetail.unshift(...others);
        return { categories, categoriesDetail };
    };

    // 获取当前分类内容
    static getSquare = async (id: number|string, page: number) => {
        const pageSize = 40;
        if ("top" == id) {
            return { square: (await this.getTop()).square };
        }
        const url = 'http://specialrecretry.service.kugou.com/special_recommend';
        const data = {
            "apiver": 2,
            "appid": 1001,
            "client_playlist": [],
            "clienttime": 760222539,
            "clientver": 10246,
            "key": "aeaae8a3a956de5cfd606d719e3317db",
            "mid": "d8de2ff0a89da0a2528dc85e66beff07",
            "module_id": 1,
            "page": page,
            "pagesize": pageSize,
            "platform": "pc",
            "req_multi": 1,
            "session": "1706878396_2",
            "special_recommend": {
                "area_code": "1",
                "categoryid": id,
                "is_selected": 0,
                "sort": 3,
                "ugc": 1,
                "withrecommend": 1,
                "withsong": 0,
                "withtag": 1
            }
        }
        const res = await post(url, data, null);
        let items: SquareItem[] = [];
        (res as any).data.special_list.forEach((item:any) => {
            const squareItem : SquareItem = {
                id: item.specialid,
                imgUrl: item.pic,
                title: item.specialname,
                group: "other",
            }
            items.push(squareItem);
        });
        let square: Square = {
            squareItems: items,
        };
        if((res as any).data.total) {
            const page = {
                size: pageSize,   // 每页大小
                total: (res as any).data.total,  // 总数
            }
            square.page = page;
        }
        return { square };
    }

    // 获取排行榜内容
    static getTop = async () => {
        const url = "http://gateway3.kugou.com/ocean/v6/rank/pc_list";
        const params = {
              'showtype': '2',
              'withsong': '1',
              'parentid': '0',
              'apiver': '1',
              'clientver': '10246',
              'clienttime': '1706971083402',
              'appid': '1001',
              'dfid': '1nhI9M0MVRfK2uTtUl4EF7yN',
              'mid': 'd8de2ff0a89da0a2528dc85e66beff07',
              'uuid': '9CC9497A36723AD48C86D6FFE0A97506',
              'area_code': '1',
              'signature': 'e7b4a1a07fd3979b9883d678ef818b00'
            }
        const res = await post(url, null, params);
        let items: SquareItem[] = [];
        (res as any).data.info.forEach((item:any) => {
            const squareItem : SquareItem = {
                id: item.rankid,
                imgUrl: item.imgurl.replace("{size}", 240),
                title: item.rankname,
                group: "top",
            }
            items.push(squareItem);
        });
        let square: Square = {
            squareItems: items,
        };
        return { square };
    }

    // 获取当前歌单内容
    static getSquareDetail = async (id: number|string, group: string, data: any) => {
        console.log(id, group, data);
        const url = `https://www.kugou.com/yy/special/single/${id}.html`;
        const res = await get(url, null);
        const parser = new DOMParser();
        const doc = parser.parseFromString(res as any, "text/html");
        const script = doc.querySelectorAll("script");
        let globalData = [] as any;
        script.forEach(s => {
            if(s.textContent!.includes("specialInfo")) {
                globalData = Function(s.textContent + ' return {data, specialInfo}')();
            }
        })
        let songs: Array<Song> = [];
        globalData.data.forEach((item:any) => {
            songs.push({
                id: item.encode_album_audio_id,
                name: item.songname,
                time: formatTime(item.duration / 1000),
                album: {id: item.album_id, name: item.album_name},
                singers: item.authors.map((s: { author_id: any, author_name: any; }) => ({mid: s.author_id, name: s.author_name})),
            })
        })
        let squareDetail: SquareDetail = {
            id: globalData.specialInfo.id,
            name: globalData.specialInfo.class_name,
            desc: globalData.specialInfo.intro,
            img: globalData.specialInfo.image,
            songs: songs,
        };
        console.log(squareDetail);
        return { squareDetail }
    }

    // 分类详情
    // static getCategoryDetailById = async (id: number|string, page: number) => {
    //     if("排行榜" == id) return { categoriesDetail: (await this.getTopList()).categoriesDetail }
    //     const a = await axios.get(URL.BASE_URL + id + `&p=${page}&pagesize=20`);
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(a.data, "text/html");
    //     const script = doc.body.querySelectorAll("script");
    //     let globalData = [] as any;
    //     script.forEach(s => {
    //         if(s?.textContent?.includes("global.special =")) {
    //             globalData = Function(s.textContent + ' return global')();
    //         }
    //     })
    //     let categoriesDetailItem: Array<CategoriesDetailItem> = [];
    //     globalData.special.forEach((cate: { img: any; specialname: any; specialid: any; }) => {
    //         categoriesDetailItem.push({
    //             imgUrl: cate.img,
    //             title: cate.specialname,
    //             tid: cate.specialid,
    //             group: "other",
    //         })
    //     })
    //     let categoriesDetail: CategoriesDetail = {
    //         categoriesDetailItem,
    //         page: {
    //             total: Number(globalData.total),
    //             size: Number(globalData.pagesize)
    //         }
    //     };
    //     return { categoriesDetail };
    // }

    // static getTopList = async () => {
    //     const a = await axios.get(URL.TOP_LIST_URL);
    //     const parser = new DOMParser();
    //     const doc = parser.parseFromString(a.data, "text/html");
    //     const categoryList = doc.body.querySelectorAll(".pc_temp_side li")
    //     let categoriesDetailItem: Array<CategoriesDetailItem> = [];
    //     categoryList.forEach(li => {
    //         categoriesDetailItem.push({
    //             imgUrl: li.querySelector("span")?.getAttribute("style")?.split('(')[1].split(')')[0]||"",
    //             title: li.querySelector("a")?.getAttribute("title")||"",
    //             tid: li.querySelector("a")?.getAttribute("href")||"",
    //             group: "top",
    //             data: {
    //                 imgUrl: li.querySelector("span")?.getAttribute("style")?.split('(')[1].split(')')[0]||"",
    //                 title: li.querySelector("a")?.getAttribute("title")||"",
    //                 tid: li.querySelector("a")?.getAttribute("href")||"",
    //             }
    //         })
    //     })
    //     let categoriesDetail: CategoriesDetail = {
    //         categoriesDetailItem
    //     };
    //     return { categoriesDetail };
    // }

    // static getMusicListDetail = async (id:string, group: string, data: any) => {
    //     if("top" == group) {
    //         const a = await axios.get(id);
    //         const parser = new DOMParser();
    //         const doc = parser.parseFromString(a.data, "text/html");
    //         const songlist = doc.body.querySelectorAll("#rankWrap .pc_temp_songlist li");
    //         let songList: Array<music> = []
    //         songlist.forEach(li => {
    //             const a = li.querySelector("a");
    //             songList.push({
    //                 mid: li.getAttribute("data-eid")||'',
    //                 name: a?.getAttribute("title")?.split("-")[1].trim()||"",
    //                 time: li.querySelector(".pc_temp_time")?.textContent?.trim()||"",
    //                 img: '',
    //                 album: {
    //                     mid: "",
    //                     name: "",
    //                 },
    //                 singer: [{mid:"", name: a?.getAttribute("title")?.split("-")[0].trim()||""}],
    //                 data: { chl: 2, html: a?.getAttribute("href") }
    //             })
    //         })
    //         let musicListDetail: musicList = {
    //             tid: data?.tid||"",
    //             title: data?.title||"",
    //             img: data?.imgUrl||"",
    //             desc: "",
    //             list: songList
    //         };
    //         return { musicListDetail };
    //     }else {
    //         const a = await axios.get(URL.MUSIC_LIST_DETAIL.replace("${id}", id));
    //         const parser = new DOMParser();
    //         const doc = parser.parseFromString(a.data, "text/html");
    //         const script = doc.querySelectorAll("script");
    //         let globalData = {} as any;
    //         script.forEach(s => {
    //             if(s?.textContent?.includes("specialInfo")) {
    //                 globalData = Function(s.textContent + ' return [data, specialInfo]')();
    //             }
    //         })
    //         let songList: Array<music> = []
    //         globalData[0].forEach((item: any) => {
    //             songList.push({
    //                 mid: item.encode_album_audio_id, // album_audio_id
    //                 name: item.songname,
    //                 time: formatTime(item.duration / 1000),
    //                 img: "",
    //                 album: {
    //                     mid: item.album_id,
    //                     name: item.album_name,
    //                 },
    //                 singer: item.authors.map((s: { author_id: any, author_name: any; }) => ({mid: s.author_id, name: s.author_name})),
    //                 data: { chl: 2, html: item.song_url }
    //             })
    //         })
    //         let musicListDetail: musicList = {
    //             tid: globalData[1]?.id||"",
    //             title: globalData[1]?.class_name||"",
    //             img: globalData[1]?.image||"",
    //             desc: globalData[1]?.intro,
    //             list: songList
    //         };
    //         return { musicListDetail };
    //     }
    // }

    // static getSongDetail = async (music: music) => {
    //     const reqBody:Record<string, any> = {
    //         srcappid: 2919,
    //         clientver: 20000,
    //         clienttime: new Date().getTime(),
    //         mid: 'caaca808a19636095e2c88dc39577a12',
    //         uuid: 'caaca808a19636095e2c88dc39577a12',
    //         dfid: '0jI0v83wGKCQ2PXgTX14074K',
    //         appid: 1014,
    //         platid: 4,
    //         encode_album_audio_id: music.mid,
    //         token: '',
    //         userid: 0
    //     }
    //     var sortedObj = Object.fromEntries(
    //         Object.entries(reqBody).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    //     );
    //     let s = jsonToKeyValueArray(sortedObj);
    //     s.push('NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt');
    //     s.unshift("NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt");
    //     const sign = CryptoJS.MD5(s.join('')).toString();
    //     reqBody['signature'] =  sign;
    //     const res = await axios.get(URL.MUSIC_URL + "?" + qs.stringify(reqBody));
    //     music.img = res.data.data.img;
    //     const playUrl = res.data.data.play_url;
    //     return { playUrl }
    // }
    
}

const getParamsAndSign = (obj:any) => {
    obj['signature'] = md5(obj)
    console.log("object:", obj);
    return obj;
}

const md5 = (obj:Object) => {
    var sortedObj = Object.fromEntries(
        Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
    let s = jsonToKeyValueArray(sortedObj);
    s.push(KEY);
    s.unshift(KEY);
    console.log("s:", s.join(''));
    const sign = CryptoJS.MD5(s.join('')).toString();
    return sign;
}

const jsonToKeyValueArray = (json:any) => {
    let keyValuePairs = [];
    for (let key in json) {
        if (json.hasOwnProperty(key)) {
            keyValuePairs.push(`${key}=${json[key]}`);
      }
    }
    console.log("keyValuePairs:", keyValuePairs);
    return keyValuePairs;
}
