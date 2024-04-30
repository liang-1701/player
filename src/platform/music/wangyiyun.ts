import { Category, CategoryItem, Square, SquareItem, SquareDetail, Song, SingerDetail, Album, Singer, SingerSquare, SingerCategory } from "@/type/musicTypes";
import { post, get } from "@/common/http";
import CryptoJS from 'crypto-js';
import { formatTime, randomText, toTrimString, timestampToDate } from '@/common/utils'
import forge from "node-forge";
import qs from "qs";

const BASE_URL = 'https://interface.music.163.com/e'
const CHL = 1
const KEY = 'e82ckenh8dichen8'
const MODULUS = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b72'
    + '5152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbd'
    + 'a92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe48'
    + '75d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7'
const NONCE = '0CoJUm6Qyw8W8jud'
const PUBLIC_KEY = '010001'
const IV = '0102030405060708'
const CHOICE = '012345679abcdef'

export class WangYiYunMusicApi {

    // 全部分类
    static getCategory = async () => {
        const data = {
            "e_r": true,
        }
        const res = await postApi('api/playlist/catalogue', data) as any;
        const groupedByCategory = res.sub.reduce((groups:any, sub:any) => {
            if (!groups[sub.category]) {
                groups[sub.category] = [];
            }
            groups[sub.category].push(sub);
            return groups;
        }, {} as {[key: number]: []});
        let categories: Array<Category> = [];
        let categoriesDetail: Array<CategoryItem> = [];
        Object.entries(res.categories).forEach(([key, value]) => {
            const items: Array<CategoryItem> = [];
            groupedByCategory[key].forEach((el:any) => {
                const categoryItem = {
                    categoryName: el.name,
                    categoryId: el.name,
                    chl: CHL
                }
                categoriesDetail.push(categoryItem);
                items.push(categoryItem);
            });
            categories.push({
                groupId: Number(key),
                name: String(value),
                categoryItems: items,
                chl: CHL
            })
        });
        let others = [
            {
                categoryId: '官方',
                categoryName: "推荐",
                default: true,
                chl: CHL
            },
            {
                categoryId: "top",
                categoryName: "排行榜",
                chl: CHL
            }
        ]
        categories.unshift({
            groupId: -1,
            name: "精选",
            categoryItems: others,
            chl: CHL
        });
        categoriesDetail.unshift(...others);
        return { categories, categoriesDetail };
    };

    // 获取当前分类内容
    static getSquare = async (id: number|string, page: number) => {
        const pageSize = 35;
        if ("top" == id) {
            return { square: (await this.getTop()).square };
        }
        // const data = {
        //     "cat": "官方",
        //     "limit": pageSize,
        //     "e_r": true,
        // }
        // const res = await postApi('api/playlist/category/list', data) as any;
        // console.log(res);
        // const promises:Promise<any>[] = res.playlistIds.slice((page - 1) * pageSize, page * pageSize).map(async (id1: number) => {
        //     const result = await getSongIds(id1);
        //     const squareItem : SquareItem = {
        //             id: result.playlist.id,
        //             imgUrl: result.playlist.coverImgUrl,
        //             title: result.playlist.name,
        //             group: "other",
        //             chl: CHL,
        //             data: {
        //                 id: result.playlist.trackIds.map((s: { id: any}) => ({id: s.id})),
        //             }
        //         }
        //     return squareItem;
        // })
        // const items = await Promise.all(promises);
        const reqBody = {
            cat: id,
            order: "hot",
            limit: pageSize,
            offset: (page - 1) * pageSize,
        };
        const res = await get('https://music.163.com/discover/playlist', reqBody, null) as any;
        const parser = new DOMParser();
        const doc = parser.parseFromString(res, "text/html");
        let items: SquareItem[] = [];
        doc.body.querySelectorAll('#m-pl-container li').forEach(li => {
            const squareItem : SquareItem = {
                id: li.querySelector(".dec a")?.getAttribute('href')?.split('=')[1]||'',
                imgUrl: li.querySelector(".u-cover img")?.getAttribute('src')||'',
                title: li.querySelector(".dec a")?.textContent||'',
                group: "other",
                chl: CHL
            }
            items.push(squareItem);
        })
        const pgEls = doc.querySelectorAll("#m-pl-pager .u-page .zpgi");
        let square: Square = {
            squareItems: items,
            chl: CHL,
        };
        if (pgEls && pgEls.length > 0) {
            const totalEl = Number(pgEls[pgEls.length - 1].textContent);
            square.page = {
                size: 35,   // 每页大小
                totalPage: totalEl,  // 总页数
            }
        }
        return { square };
    }

    // 获取排行榜内容
    static getTop = async () => {
        const data = {
            "e_r": true,
        }
        const res = await postApi('api/toplist/detail/v2', data) as any;
        let items: SquareItem[] = [];
        res.data.forEach((item:any) => {
            item.list.forEach((el:any) => {
                if (el.id == 0) return;
                const squareItem : SquareItem = {
                    id: el.id,
                    imgUrl: el.coverUrl,
                    title: el.name,
                    group: "top",
                    chl: CHL,
                }
                items.push(squareItem);
            });
        });
        let square: Square = {
            squareItems: items,
            chl: CHL
        };
        return { square };
    }

    // 获取当前歌单内容
    static getSquareDetail = async (id: number|string, group: string, data: any) => {
        const params = {
            id: id,
            offset: 0,
            total: true,
            limit: 1000,
            n: 1000,
            csrf_token: ''
        };
        const res = await post('https://music.163.com/weapi/v3/playlist/detail', qs.stringify(weapi(params)), null) as any;
        const c = res.playlist.trackIds.map((s: { id: any}) => ({id: String(s.id)}));
        const ids = res.playlist.trackIds.map((s: { id: any}) => (String(s.id)));
        const res1 = await post('https://music.163.com/weapi/v3/song/detail', qs.stringify(weapi({c:JSON.stringify(c), ids:JSON.stringify(ids)})), null) as any;
        let songs: Array<Song> = [];
        res1.songs.forEach((item:any) => {
            songs.push({
                id: item.id,
                name: item.name,
                time: formatTime(item.dt/1000),
                album: {id: item.al.id, name: item.al.name, chl: CHL},
                singers: item.ar.map((s: { id: any, name: any}) => ({id: s.id, name: s.name, chl: CHL})),
                img: item.al.picUrl,
                chl: CHL
            })
        })
        let squareDetail: SquareDetail = {
            id: res.playlist.id,
            name: res.playlist.name,
            desc: res.playlist.description,
            img: res.playlist.coverImgUrl,
            songs: songs,
            chl: CHL
        };
        return { squareDetail }
    }
    
    static getSongDetail = async (song: Song) => {
        let params = {
            ids: [song.id],
            level: 'standard',
            encodeType: 'flac', //aac
            csrf_token: ''
        };
        const res = await post('https://music.163.com/weapi/song/enhance/player/url/v1', qs.stringify(weapi(params)), null) as any;
        let lyricsParams = {
            id: song.id,
            lv: -1,
            tv: -1,
            csrf_token: ''
        };
        const res1 = await post('https://music.163.com/weapi/song/lyric', qs.stringify(weapi(lyricsParams)), null) as any;
        let playUrl = res.data[0].url;
        song.lyrics = parseLyrics(res1.lrc.lyric);
        return { playUrl }
    }
    
    // 歌曲搜索
    static searchSongs = async (keyword: string, page: number) => {
        const pageSize = 20;
        const data = {
            keyword: keyword,
            scene: 'NORMAL',
            limit: pageSize,
            offset: pageSize * (page - 1),
            needCorrect: 'true',
            e_r: true,
        }
        const res = await postApi('api/search/song/page', data)
        let songs: Array<Song> = [];
        res.data.resources.forEach((item:any) => {
            songs.push({
                id: item.baseInfo.id,
                name: item.baseInfo.name,
                time: formatTime(item.baseInfo.dt/1000),
                album: {id: item.baseInfo.al.id, name: item.baseInfo.al.name, chl: CHL},
                singers: item.baseInfo.ar.map((s: { id: any, name: any}) => ({id: s.id, name: s.name, chl: CHL})),
                img: item.baseInfo.al.picUrl,
                chl: CHL
            })
        });
        return { songs };
    }

    // 歌单搜索
    static searchSpecials = async (keyword: string, page: number) => {
        const pageSize = 20;
        const data = {
            s: keyword,
            limit: pageSize,
            offset: pageSize * (page - 1),
            queryCorrect: 'true',
            e_r: true,
        }
        const res = await postApi('api/v1/search/playlist/get', data)
        let specials: Array<SquareItem> = [];
        res.result.playlists.forEach((item:any) => {
            const squareItem : SquareItem = {
                id: Number(item.id),
                imgUrl: item.coverImgUrl,
                title: item.name,
                group: "other",
                chl: CHL
            }
            specials.push(squareItem);
        });
        return { specials };
    }

    // 歌手搜索
    static searchSingers = async (keyword: string, page: number) => {
        const pageSize = 20;
        const data = {
            s: keyword,
            limit: pageSize,
            offset: pageSize * (page - 1),
            queryCorrect: 'true',
            e_r: true,
        }
        const res = await postApi('api/v1/search/artist/get', data)
        let singers: Array<Singer> = [];
        res.result.artists.forEach((item:any) => {
            const singer : Singer = {
                id: item.id,
                name: item.name,
                img: item.picUrl,  // 封面
                chl: CHL
            }
            singers.push(singer);
        });
        return { singers };
    }

    // 专辑搜索
    static searchAlbums = async (keyword: string, page: number) => {
        const pageSize = 20;
        const data = {
            s: keyword,
            limit: pageSize,
            offset: pageSize * (page - 1),
            queryCorrect: 'true',
            e_r: true,
        }
        const res = await postApi('api/v1/search/album/get', data)
        let albums: Array<Album> = [];
        res.result.albums.forEach((item:any) => {
            const album : Album = {
                id: item.id,
                name: item.name,
                img: item.picUrl, // 封面
                time: timestampToDate(item.publishTime),  // 发行时间
                singer: item.artists.map((s: { id: any, name: any, picUrl: any}) => ({id: s.id, name: s.name, img: s.picUrl, chl: CHL})),
                chl: CHL
            }
            albums.push(album);
        });
        return { albums };
        
    }
    
    // 歌手详情
    static getSingerDetail = async (singer: Singer, page: number) => {
        const pageSize = 100;
        const reqBody = {
            id: singer.id,
        };
        const res = await get('https://music.163.com/artist', reqBody, null) as any;
        const parser = new DOMParser();
        const doc = parser.parseFromString(res, "text/html");
        let img = doc.querySelector(".n-artist img")!.getAttribute('src')||'';
        singer.img = img;
        const data = {
            id: singer.id,
            limit: pageSize,
            offset: pageSize * (page - 1),
            e_r: true,
        }
        const res1 = await postApi('api/v2/artist/songs', data)
        let recommend: Array<Song> = [];
        res1.songs.forEach((item:any) => {
            recommend.push({
                id: item.id,
                name: item.name,
                time: formatTime(item.duration / 1000),
                img: item.album.picUrl,
                album: {id: item.album.mid, name: item.album.name, img: item.album.picUrl, chl: CHL},
                singers: item.artists.map((s: { id: any, name: any}) => ({id: s.id, name: s.name, chl: CHL})),
                chl: CHL
            })
        });
        let singerDetail: SingerDetail = {
            id: singer.id,
            name: singer.name,
            img: singer.img,
            songsTotal: res1.total,
            recommend: recommend,
            chl: CHL
        };
        return { singerDetail };
    }

    // 通过歌手获得歌曲
    static getSongsBySinger = async (singer: Singer, page: number) => {
        const pageSize = 30;
        const data = {
            id: singer.id,
            limit: pageSize,
            offset: pageSize * (page - 1),
            e_r: true,
        }
        const res1 = await postApi('api/v2/artist/songs', data)
        let songs: Array<Song> = [];
        res1.songs.forEach((item:any) => {
            songs.push({
                id: item.id,
                name: item.name,
                time: formatTime(item.duration / 1000),
                img: item.album.picUrl,
                album: {id: item.album.mid, name: item.album.name, img: item.album.picUrl, chl: CHL},
                singers: item.artists.map((s: { id: any, name: any}) => ({id: s.id, name: s.name, chl: CHL})),
                chl: CHL
            })
        });
        return { songs };
    }

    // 通过歌手获得专辑
    static getAlbumsBySinger = async (singer: Singer, page: number) => {
        const pageSize = 30;
        const data = {
            limit: pageSize,
            offset: pageSize * (page - 1),
            e_r: true,
        }
        const res = await postApi(`api/artist/albums/${singer.id}`, data)
        let albums: Array<Album> = [];
        res.hotAlbums.forEach((item:any) => {
            albums.push({
                id: item.id,
                name: item.name,
                img: item.picUrl, // 封面
                time: timestampToDate(item.publishTime),  // 发行时间
                singer: singer,
                chl: CHL
            })
        });
        return { albums };
    }

    // 专辑详情
    static getAlbumDetail = async (album: Album) => {
        const reqBody = {
            id: album.id,
        };
        const res = await get('https://music.163.com/album', reqBody, null) as any;
        console.log(res);
        const parser = new DOMParser();
        const doc = parser.parseFromString(res, "text/html");
        let songs: Array<Song> = [];
        const spans = doc.body.querySelectorAll('.n-songtb .m-table tbody span[data-res-id]');
        console.log(spans);
        res.req_2.data.songList.forEach((item:any) => {
            const songInfo = item.songInfo;
            songs.push({
                id: songInfo.mid,
                name: songInfo.name,
                time: formatTime(songInfo.interval),
                album: {id: songInfo.album.mid, name: songInfo.album.name, chl: CHL},
                singers: songInfo.singer.map((s: { mid: any, name: any}) => ({id: s.mid, name: s.name, chl: CHL})),
                chl: CHL
            })
        });
        let albumDetail = {
            id: album.id,
            name: album.name,
            img: album.img || doc.body.querySelector('.m-info .cover img')?.getAttribute('src'),  // 封面
            time: album.time || doc.body.querySelectorAll('.m-info .intr')![1]!.lastChild!.textContent,  // 发行时间
            desc: doc.body.querySelector('.n-albdesc #album-desc-dot')?.textContent,  // 描述
            singer: album.singer || songs[0].singers[0],  // 歌手
            songs: songs,
            chl: CHL
        };
        return { albumDetail };
    }

    // 所有歌手
    static getAllSingers = async () => {
        let categories: Record<string, Array<SingerCategory>> = {};
        let area: Array<SingerCategory> = [];
        area.push({id: '-1', name: '全部', chl: CHL, default: true});
        area.push({id: '7', name: '华语', chl: CHL});
        area.push({id: '96', name: '欧美', chl: CHL});
        area.push({id: '8', name: '日本', chl: CHL});
        area.push({id: '16', name: '韩国', chl: CHL});
        area.push({id: '0', name: '其他', chl: CHL});
        categories['area'] = area;
        let type: Array<SingerCategory> = [];
        type.push({id: '-1', name: '全部', chl: CHL, default: true});
        type.push({id: '1', name: '男歌手', chl: CHL});
        type.push({id: '2', name: '女歌手', chl: CHL});
        type.push({id: '3', name: '乐队组合', chl: CHL});
        categories['type'] = type;
        let initial: Array<SingerCategory> = [];
        initial.push({id: '-1', name: '热门', chl: CHL, default: true});
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach((item: string) => {
            initial.push({id: item.charCodeAt(0).toString(), name: item, chl: CHL});
        })
        initial.push({id: '0', name: '#', chl: CHL});
        categories['initial'] = initial;
        let singerSquare : SingerSquare = {categories: categories, chl: CHL};
        let singers = (await this.getSingersByTypes({area: '-1', type: '-1', initial: '-1'}, 1)).singers;
        return { singerSquare, singers };
    }

    // 查询歌手
    static getSingersByTypes = async (data:any, page:number) => {
        const pageSize = 30;
        const params = {
            area: data['area'],
            type: data['type'],
            initial: data['initial'],
            limit: pageSize,
            offset: pageSize * (page - 1),
            e_r: true,
        }
        const res = await postApi(`api/v1/artist/list`, params)
        let singers: Array<Singer> = [];
        res.artists.forEach((item: any) => {
            singers.push({
                id: item.id,
                name: item.name,
                img: item.picUrl,  // 封面
                chl: CHL
            })
        })
        return { singers };
    }
}

const parseLyrics = (lyrics: string) => {
    if (!lyrics) return;
    const lines = lyrics!.split(/\r?\n/);
    const pattern = /\[\d{2}:\d{2}(?:\.\d{1,3})?\]/g;
    let lyricsArr = [] as any;
    lines.forEach((line) => {
        const time = line.match(pattern);
        if (!time) return;
        const txt = line.replace(pattern, '').trim();
        lyricsArr.push({ time: time[0].replace("[", "").replace("]", ""), txt: txt });
    })
    return lyricsArr;
}

const postApi = async (url: string, data: any) => {
    const res = await post(`${BASE_URL}${url}?params=${encrypt(encryptMd5(url, data))}`, {}, {responseType: 'arraybuffer'});
    return JSON.parse(decrypt(res)!);
}

const decrypt = (text: any) => {
    const keyWordArray = CryptoJS.enc.Utf8.parse(KEY);
    const encryptedBytes = CryptoJS.lib.WordArray.create(text);
    // const encryptedDataWordArray = CryptoJS.enc.Hex.parse(res) as any;
    const cipherParams = { ciphertext: encryptedBytes } as unknown as CryptoJS.lib.CipherParams;
    const decryptedWordArray = CryptoJS.AES.decrypt(cipherParams, keyWordArray, { mode: CryptoJS.mode.ECB });
    try {
        let decryptedText = CryptoJS.enc.Utf8.stringify(decryptedWordArray);
        return decryptedText;
    } catch (error) {
        console.error('解密失败:', error);
    }
}

const encrypt = (text: any) => {
    const keyWordArray = CryptoJS.enc.Utf8.parse(KEY);
    // const encryptedBytes = CryptoJS.lib.WordArray.create(text);
    // const encryptedDataWordArray = CryptoJS.enc.Hex.parse(res) as any;
    const encrypted = CryptoJS.AES.encrypt(text, keyWordArray, { mode: CryptoJS.mode.ECB });
    const encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex).toUpperCase();
    return encryptedHex;
}

const encryptMd5 = (url: string, data: any) => {
    const dataString = JSON.stringify(data);
    const message = `nobody/${url}use${dataString}md5forencrypt`
    const sign = CryptoJS.MD5(message).toString();
    const params = `/${url}-36cd479b6b5-${dataString}-36cd479b6b5-${sign}`;
    return params;
}

const weapi = (text:any) => {
    if (typeof (text) === 'object') text = JSON.stringify(text);
    const secretkey = randomText(CHOICE, 16);
    const base64Text = aesEncryptText(text, null, NONCE, IV);
    const params = aesEncryptText(base64Text, null, secretkey, IV);
    const encSecKey = rsaEncrypt(secretkey, PUBLIC_KEY, MODULUS);
    return { params, encSecKey }
}

// aes加密
const aesEncryptText = (src:any, mode:any, secKey:any, iv:any) => {
    src = CryptoJS.enc.Utf8.parse(src);
    mode = mode || CryptoJS.mode.CBC;
    secKey = CryptoJS.enc.Utf8.parse(secKey);
    iv = CryptoJS.enc.Utf8.parse(iv);
    return CryptoJS.AES.encrypt(src, secKey, { mode, iv, padding: CryptoJS.pad.Pkcs7 }).toString();
}

// rsa加密
const rsaEncrypt = (src:any, publicKey:any, modulus:any) => {
    src = toTrimString(src).split('').reverse().join('');
    const m = new forge.jsbn.BigInteger(modulus, 16);
    const k = new forge.jsbn.BigInteger(publicKey, 16);
    const s = new forge.jsbn.BigInteger(forge.util.bytesToHex(src), 16);
    return s.modPow(k, m).toString(16).padStart(256, '0');
}