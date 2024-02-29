// import axios from "axios";
// import qs from "qs";
// import { Category, CategoryItem, CategoriesDetailItem, musicList, music, CategoriesDetail } from "@/type/musicTypes";
// import { formatTime, randomText, toTrimString } from '@/common/utils'
// import CryptoJS from 'crypto-js';
// import forge from "node-forge";

// //常量
// const MODULUS = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b72'
//     + '5152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbd'
//     + 'a92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe48'
//     + '75d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'
// const NONCE = '0CoJUm6Qyw8W8jud'
// const PUBLIC_KEY = '010001'
// const IV = '0102030405060708'
// const CHOICE = '012345679abcdef'
// // const EAPI_KEY = 'e82ckenh8dichen8'
// // const EAPI_PADDING_KEY = '36cd479b6b5'

// enum URL {
//     BASE_URL = "https://music.163.com",
//     CATEGORY_LIST_URL = "https://music.163.com/discover/playlist",
//     CATEGORY_DETAIL_URL = "https://music.163.com/discover/playlist?cat=${cate}&order=hot&limit=${limit}&offset=${offset}",
//     TOP_LIST_URL = "https://music.163.com/discover/toplist",
//     MUSIC_LIST_DETAIL_1 = "https://music.163.com/weapi/v3/playlist/detail",
//     MUSIC_LIST_DETAIL_2 = "https://music.163.com/weapi/v3/song/detail",
//     MUSIC_PLAY_URL = "https://music.163.com/weapi/song/enhance/player/url/v1?csrf_token="
// }

// export class WangYiYunMusicApi {

//     // 全部分类
//     static getCategoryList = async () => {
//         const a = await axios.get(URL.CATEGORY_LIST_URL);
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(a.data, "text/html");
//         const categoryList = doc.body.querySelectorAll("#cateListBox .f-cb")
//         let categoriesArray: Array<Category> = [];
//         let categoriesDetail: Array<CategoryItem> = [];
//         categoryList.forEach((el, index) => {
//             let categories: Array<CategoryItem> = [];
//             const dt = el.querySelector("dt")?.textContent;
//             el.querySelectorAll(".s-fc1 ")?.forEach((dd) => {
//                 const categoryItem: CategoryItem = {
//                     categoryName: dd.textContent||'',
//                     categoryId: dd.textContent||'',
//                 }
//                 categories.push(categoryItem);
//                 categoriesDetail.push(categoryItem);
//             });
//             categoriesArray.push({
//                 categoryGroupName: dt||'',
//                 groupId: index,
//                 items: categories,
//             })
//         });
//         let items = [
//             {
//                 categoryId: "官方",
//                 categoryName: "推荐",
//                 default: true
//             },
//             {
//                 categoryId: "排行榜",
//                 categoryName: "排行榜",
//             }
//         ]
//         // 推荐, 排行榜
//         let recommended = {
//             groupId: -1,
//             categoryGroupName: "精选",
//             items
//         };
//         categoriesDetail.unshift(...items);
//         categoriesArray.unshift(recommended)
//         return { categoriesArray, categoriesDetail };
//     };

//     // 分类详情
//     static getCategoryDetailById = async (id: number|string, page: number) => {
//         if("排行榜" == id) return { categoriesDetail: (await this.getTopList()).categoriesDetail }
//         const reqBody = {
//             cat: id,
//             order: "hot",
//             limit: 35,
//             offset: (page - 1) * 35,
//         };
//         const a = await axios.get(URL.CATEGORY_LIST_URL + "?" + qs.stringify(reqBody));
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(a.data, "text/html");
//         let categoriesDetailItem: Array<CategoriesDetailItem> = [];
//         doc.body.querySelectorAll("#m-pl-container li")?.forEach((li) => {
//             categoriesDetailItem.push({
//                 imgUrl: li.querySelector(".u-cover img")?.getAttribute('src')||'',
//                 title: li.querySelector(".dec a")?.textContent||'',
//                 tid: li.querySelector(".dec a")?.getAttribute('href')?.split('=')[1]||'',
//                 group: "other",
//             })
//         })
//         const pgEls = doc.querySelectorAll("#m-pl-pager .u-page .zpgi");
//         let categoriesDetail: CategoriesDetail = {
//             categoriesDetailItem,
//         };
//         if (pgEls && pgEls.length > 0) {
//             const totalEl = Number(pgEls[pgEls.length - 1].textContent);
//             categoriesDetail.page = {
//                 size: 35,   // 每页大小
//                 totalPage: totalEl,  // 总页数
//             }
//         }
//         return { categoriesDetail };
//     }

//     static getTopList = async () => {
//         const a = await axios.get(URL.TOP_LIST_URL);
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(a.data, "text/html");
//         const topLi = doc.body.querySelectorAll("#toplist li");
//         let categoriesDetailItem: Array<CategoriesDetailItem> = [];
//         topLi.forEach(item => {
//             const img = item.querySelector(".mine .left img")
//             const name = item.querySelector(".mine .name a")
//             if (!img) return;
//             categoriesDetailItem.push({
//                 imgUrl: img?.getAttribute('src')?.split('?')[0] + "?param=300y300"||'',
//                 title: name?.textContent||'',
//                 tid: name?.getAttribute('href')?.split("=")[1]||'',
//                 group: "top",
//             })
//         })
//         let categoriesDetail: CategoriesDetail = {
//             categoriesDetailItem,
//         };
//         return { categoriesDetail };
//     }

//     static getMusicListDetail = async (id: number|string, _group: string, _data: any) => {
//         let param = {
//             id,
//             offset: 0,
//             total: true,
//             limit: 1000,
//             n: 1000,
//             csrf_token: ''
//         };
//         const res1 = await axios.post(URL.MUSIC_LIST_DETAIL_1, qs.stringify(weapi(param)));
//         let ids: any[] = [];
//         let c:any[] = [];
//         res1.data.playlist.trackIds.forEach((item: { id: any; }) =>{ 
//             ids.push(item.id)
//             c.push({id: item.id})
//         })
//         const res2 = await axios.post(URL.MUSIC_LIST_DETAIL_2, qs.stringify(weapi({c:JSON.stringify(c), ids:JSON.stringify(ids)})));
//         let songList: Array<music> = []
//         res2.data.songs.forEach((item: { id: any; name: any; dt: number; al: { picUrl: any; id: any; name: any; }; ar: { id: any; name: any; }[]; }) => {
//             songList.push({
//                 mid: item.id,
//                 name: item.name,
//                 time: formatTime(item.dt / 1000),
//                 img: item.al.picUrl,
//                 album: {
//                     mid: item.al.id,
//                     name: item.al.name,
//                 },
//                 singer: item.ar.map((s: { id: any, name: any; }) => ({mid: s.id, name: s.name})),
//                 data: { chl: 1 }
//             })
//         })
//         let musicListDetail: musicList = {
//             tid: res1.data.playlist.id,
//             title: res1.data.name,
//             img: res1.data.playlist.coverImgUrl,
//             desc: res1.data.playlist.description,
//             list: songList
//         };
//         return { musicListDetail };
//     }

//     static getSongDetail = async (music: music) => {
//         let param = {
//             ids: [music.mid],
//             level: 'standard',
//             encodeType: 'flac', //aac
//             csrf_token: ''
//         };
//         const res = await axios.post(URL.MUSIC_PLAY_URL, qs.stringify(weapi(param)));
//         let playUrl = res.data.data[0].url;
//         return { playUrl }
//     }

// }
// const weapi = (text:any) => {
//     if (typeof (text) === 'object') text = JSON.stringify(text);
//     const secretkey = randomText(CHOICE, 16);
//     const base64Text = aesEncryptText(text, null, NONCE, IV);
//     const params = aesEncryptText(base64Text, null, secretkey, IV);
//     const encSecKey = rsaEncrypt(secretkey, PUBLIC_KEY, MODULUS);
//     return { params, encSecKey }
// }

// // aes加密
// const aesEncryptText = (src:any, mode:any, secKey:any, iv:any) => {
//     src = CryptoJS.enc.Utf8.parse(src);
//     mode = mode || CryptoJS.mode.CBC;
//     secKey = CryptoJS.enc.Utf8.parse(secKey);
//     iv = CryptoJS.enc.Utf8.parse(iv);
//     return CryptoJS.AES.encrypt(src, secKey, { mode, iv, padding: CryptoJS.pad.Pkcs7 }).toString();
// }

// // rsa加密
// const rsaEncrypt = (src:any, publicKey:any, modulus:any) => {
//     src = toTrimString(src).split('').reverse().join('');
//     const m = new forge.jsbn.BigInteger(modulus, 16);
//     const k = new forge.jsbn.BigInteger(publicKey, 16);
//     const s = new forge.jsbn.BigInteger(forge.util.bytesToHex(src), 16);
//     return s.modPow(k, m).toString(16).padStart(256, '0');
// }