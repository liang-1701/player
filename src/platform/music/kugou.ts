import { Category, CategoryItem, Square, SquareItem, SquareDetail, Song, SingerDetail, Album, Singer, SingerSquare, SingerCategory } from "@/type/musicTypes";
import { formatTime } from '@/common/utils'
import CryptoJS from 'crypto-js';
import { post, get } from "@/common/http";

const KEY = 'NVPh5oo715z5DIWAeQlhMDsWXXQV4hwt';
const CHL = 2

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
        const res = await post(url, data, params, null);
        (res as any).data.forEach((item: any) => {
            const items: Array<CategoryItem> = [];
            item.son.forEach((el:any) => {
                const categoryItem = {
                    categoryName: el.tag_name,
                    categoryId: el.tag_id,
                    chl: CHL
                }
                categoriesDetail.push(categoryItem);
                items.push(categoryItem);
            });
            categories.push({
                groupId: item.tag_id,
                name: item.tag_name,
                categoryItems: items,
                chl: CHL
            })
        });
        let others = [
            {
                categoryId: 0,
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
        const pageSize = 40;
        if ("top" == id) {
            return { square: (await this.getTop()).square };
        }
        const url = 'http://specialrecretry.service.kugou.com/special_recommend';
        const data = {
            "apiver": 2,
            "appid": 1001,
            "clienttime": 761601648,
            "clientver": 10246,
            "key": "66b8a0753b36ef8e49d366fd1313a216",
            "mid": "d8de2ff0a89da0a2528dc85e66beff07",
            "module_id": 1,
            "page": page,
            "pagesize": pageSize,
            "platform": "pc",
            "req_multi": 1,
            "session": "1708257562_0",
            "special_recommend": {
                "area_code": "1",
                "categoryid": id,
                "is_selected": 0,
                "sort": 2,
                "ugc": 1,
                "withrecommend": 1,
                "withsong": 0,
                "withtag": 1
            }
        }
        const res = await post(url, data, null, null);
        let items: SquareItem[] = [];
        (res as any).data.special_list.forEach((item:any) => {
            const squareItem : SquareItem = {
                id: item.specialid,
                imgUrl: item.imgurl.replace("{size}", 240),
                title: item.specialname,
                group: "other",
                chl: CHL
            }
            items.push(squareItem);
        });
        let square: Square = {
            squareItems: items,
            chl: CHL
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
        const res = await post(url, null, params, null);
        let items: SquareItem[] = [];
        (res as any).data.info.forEach((item:any) => {
            const squareItem : SquareItem = {
                id: item.rankid,
                imgUrl: item.imgurl.replace("{size}", 240),
                title: item.rankname,
                group: "top",
                chl: CHL
            }
            items.push(squareItem);
        });
        let square: Square = {
            squareItems: items,
            chl: CHL
        };
        return { square };
    }

    // 获取当前歌单内容
    static getSquareDetail = async (id: number|string, group: string, data: any) => {
        if ("top" == group) {
            return { squareDetail: (await this.getTopList(id, data)).squareDetail };
        }
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
                id: item.album_audio_id,
                name: item.songname,
                time: formatTime(item.duration / 1000),
                album: {id: item.album_id, name: item.album_name, chl: CHL},
                singers: item.authors.map((s: { author_id: any, author_name: any, sizable_avatar: any}) => ({id: s.author_id, name: s.author_name, img: s.sizable_avatar.replace("{size}", 240), chl: CHL})),
                chl: CHL
            })
        })
        let squareDetail: SquareDetail = {
            id: globalData.specialInfo.id,
            name: globalData.specialInfo.class_name,
            desc: globalData.specialInfo.intro,
            img: globalData.specialInfo.image,
            songs: songs,
            chl: CHL
        };
        return { squareDetail }
    }

    // 获得当前排行榜内容
    static getTopList = async (id: number|string, _data: any) => {
        const url = 'https://m.kugou.com/rank/info/';
        const params = {
                "rankid": id,
                "page": 1,
                "json": true
            }
        const res = await get(url, params);
        const info = (res as any).info;
        const body = {
                "appid": 1001,
                "clientver": "10246",
                "mid": "d8de2ff0a89da0a2528dc85e66beff07",
                "clienttime": new Date().getTime(),
                "key": "33551f4ee99f68a7deb4a384bacb508f",
                "area_code": "1",
                "show_video": 1,
                "page": 1,
                "pagesize": 500,
                "rank_id": info.rank_cid,
                "rank_cid": info.rank_cid,
                "zone": "tx6_gz_kmr"
            }
        const res1 = await post('http://kmr.service.kugou.com/container/v2/rank_audio', body, null, null);
        let songs: Array<Song> = [];
        (res1 as any).data.forEach((item:any) => {
            songs.push({
                id: item.album_audio_id,
                name: item.songname,
                time: formatTime(item.timelength / 1000),
                album: {id: item.album_id, name: item.album_name, img: item.album_sizable_cover.replace("{size}", 240), chl: CHL},
                singers: item.authors.map((s: { author_id: any, author_name: any, sizable_avatar: any}) => ({id: s.author_id, name: s.author_name, img: s.sizable_avatar.replace("{size}", 240), chl: CHL})),
                chl: CHL
            })
        })
        let squareDetail: SquareDetail = {
            id: info.rank_cid,
            name: info.rankname,
            desc: info.intro,
            updateTime: info.rank_id_publish_date,
            img: info.imgurl.replace("{size}", 240),
            songs: songs,
            chl: CHL
        };
        return { squareDetail }
    }

    static getSongDetail = async (song: Song) => {
        const reqBody:Record<string, any> = {
            srcappid: 2919,
            clientver: 20000,
            clienttime: new Date().getTime(),
            mid: 'caaca808a19636095e2c88dc39577a12',
            uuid: 'caaca808a19636095e2c88dc39577a12',
            dfid: '0jI0v83wGKCQ2PXgTX14074K',
            appid: 1014,
            platid: 4,
            album_audio_id: song.id,
            token: '',
            userid: 0
        }
        const res = await get('https://wwwapi.kugou.com/play/songinfo', getParamsAndSign(reqBody)) as any;
        song.img = res.data.img;
        song.lyrics = parseLyrics(res.data.lyrics);
        const playUrl = res.data.play_url;
        return { playUrl }
    }
    
    // 歌曲搜索
    static searchSongs = async (keyword: string, page: number) => {
        const reqBody:Record<string, any> = {
            'srcappid': '2919',
            'clientver': '1000',
            'clienttime': '1708433791286',
            'mid': 'caaca808a19636095e2c88dc39577a12',
            'uuid': 'caaca808a19636095e2c88dc39577a12',
            'dfid': '0jI0v83wGKCQ2PXgTX14074K',
            'keyword': keyword,
            'page': page,
            'pagesize': '20',
            'bitrate': '0',
            'isfuzzy': '0',
            'inputtype': '0',
            'platform': 'WebFilter',
            'userid': '0',
            'iscorrection': '1',
            'privilege_filter': '0',
            'filter': '10',
            'token': '',
            'appid': '1014',
        }
        const res = await get('https://complexsearch.kugou.com/v2/search/song', getParamsAndSign(reqBody)) as any;
        let songs: Array<Song> = [];
        res.data.lists.forEach((item:any) => {
            songs.push({
                id: item.ID,
                name: item.SongName,
                time: formatTime(item.Duration),
                album: {id: item.AlbumID , name: item.AlbumName, chl: CHL},
                singers: item.Singers.map((s: { id: any, name: any}) => ({id: s.id, name: s.name, chl: CHL})),
                chl: CHL
            })
        });
        return { songs };
        
    }

    // 歌单搜索
    static searchSpecials = async (keyword: string, page: number) => {
        const reqBody:Record<string, any> = {
            'srcappid': '2919',
            'clientver': '1000',
            'clienttime': '1708433791286',
            'mid': 'caaca808a19636095e2c88dc39577a12',
            'uuid': 'caaca808a19636095e2c88dc39577a12',
            'dfid': '0jI0v83wGKCQ2PXgTX14074K',
            'keyword': keyword,
            'page': page,
            'pagesize': '20',
            'bitrate': '0',
            'isfuzzy': '0',
            'inputtype': '0',
            'platform': 'WebFilter',
            'userid': '0',
            'iscorrection': '1',
            'privilege_filter': '0',
            'filter': '10',
            'token': '',
            'appid': '1014',
        }
        const res = await get('https://complexsearch.kugou.com/v1/search/special', getParamsAndSign(reqBody)) as any;
        let specials: Array<SquareItem> = [];
        res.data.lists.forEach((item:any) => {
            const squareItem : SquareItem = {
                id: item.specialid,
                imgUrl: item.img,
                title: item.specialname,
                group: "other",
                chl: CHL
            }
            specials.push(squareItem);
        });
        return { specials };
        
    }

    // 歌手搜索
    static searchSingers = async (keyword: string, page: number) => {
        const reqBody:Record<string, any> = {
            'srcappid': '2919',
            'clientver': '1000',
            'clienttime': '1708433791286',
            'mid': 'caaca808a19636095e2c88dc39577a12',
            'uuid': 'caaca808a19636095e2c88dc39577a12',
            'dfid': '0jI0v83wGKCQ2PXgTX14074K',
            'keyword': keyword,
            'page': page,
            'pagesize': '20',
            'bitrate': '0',
            'isfuzzy': '0',
            'inputtype': '0',
            'platform': 'WebFilter',
            'userid': '0',
            'iscorrection': '1',
            'privilege_filter': '0',
            'filter': '10',
            'token': '',
            'appid': '1014',
        }
        const res = await get('https://complexsearch.kugou.com/v1/search/author', getParamsAndSign(reqBody)) as any;
        let singers: Array<Singer> = [];
        res.data.lists.forEach((item:any) => {
            const singer : Singer = {
                id: item.AuthorId,
                name: item.AuthorName,
                img: item.Avatar,  // 封面
                chl: CHL
            }
            singers.push(singer);
        });
        return { singers };
        
    }

    // 专辑搜索
    static searchAlbums = async (keyword: string, page: number) => {
        const reqBody:Record<string, any> = {
            'srcappid': '2919',
            'clientver': '1000',
            'clienttime': '1708433791286',
            'mid': 'caaca808a19636095e2c88dc39577a12',
            'uuid': 'caaca808a19636095e2c88dc39577a12',
            'dfid': '0jI0v83wGKCQ2PXgTX14074K',
            'keyword': keyword,
            'page': page,
            'pagesize': '20',
            'bitrate': '0',
            'isfuzzy': '0',
            'inputtype': '0',
            'platform': 'WebFilter',
            'userid': '0',
            'iscorrection': '1',
            'privilege_filter': '0',
            'filter': '10',
            'token': '',
            'appid': '1014',
        }
        const res = await get('https://complexsearch.kugou.com/v1/search/album', getParamsAndSign(reqBody)) as any;
        let albums: Array<Album> = [];
        res.data.lists.forEach((item:any) => {
            const album : Album = {
                id: item.albumid,
                name: item.albumname,
                img: item.img, // 封面
                time: item.publish_time,  // 发行时间
                singer: item.singers.map((s: { id: any, name: any}) => ({id: s.id, name: s.name, chl: CHL})),
                chl: CHL
            }
            albums.push(album);
        });
        return { albums };
        
    }
    
    // 歌手详情
    static getSingerDetail = async (singer: Singer, page: number) => {
        if(singer.id === undefined || singer.id === null || singer.id === '') {
            const singerHtml = await get(singer.data!.html, null) as any;
            const parser = new DOMParser();
            const doc = parser.parseFromString(singerHtml, "text/html");
            const script = doc.querySelectorAll("script");
            let globalData = [] as any;
            script.forEach(s => {
                if(s.textContent!.includes("singerID")) {
                    globalData = Function(s.textContent + ' return {singerID}')();
                }
            })
            singer.id = globalData.singerID;
        }
        if(!singer.img) {
            const singerHtml = await get(`https://www.kugou.com/singer/info/${singer.id}/`, null) as any;
            const parser = new DOMParser();
            const doc = parser.parseFromString(singerHtml, "text/html");
            const imgUrl = doc.querySelector(".sng_ins_1 .top img")?.getAttribute('_src');
            singer.img = imgUrl || '';
        }
        const data = {
            "appid": 1001,
            "clientver": 10246,
            "mid": "d8de2ff0a89da0a2528dc85e66beff07",
            "clienttime": 1708692038898,
            "key": "fbb5a08c54eff6787829da3ba57ee5c3",
            "author_id": singer.id,
            "sort": 1,
            "page": page,
            "pagesize": 20,
            "area_code": "all"
        }
        // 推荐
        const res = await post('http://kmr.service.kugou.com/container/v2/audio_group/author', data, null, null) as any;
        let recommend: Array<Song> = [];
        res.data.forEach((item:any) => {
            recommend.push({
                id: item.album_audio_id,
                name: item.audio_name,
                time: formatTime(item.timelength / 1000),
                album: {id: item.album_id, name: item.album_name, chl: CHL},
                singers: [{id: singer.id, name: item.author_name, chl: CHL}],
                chl: CHL
            })
        });
        let singerDetail: SingerDetail = {
            id: singer.id,
            name: singer.name,
            img: singer.img,
            songsTotal: res.total,
            recommend: recommend,
            chl: CHL
        };
        return { singerDetail };
    }

    // 通过歌手获得歌曲
    static getSongsBySinger = async (singer: Singer, page: number) => {
        const data = {
            "appid": 1001,
            "clientver": 10246,
            "mid": "d8de2ff0a89da0a2528dc85e66beff07",
            "clienttime": 1708692038898,
            "key": "fbb5a08c54eff6787829da3ba57ee5c3",
            "author_id": singer.id,
            "sort": 1,
            "page": page,
            "pagesize": 20,
            "area_code": "all"
        }
        // 推荐
        const res = await post('http://kmr.service.kugou.com/container/v2/audio_group/author', data, null, null) as any;
        let songs: Array<Song> = [];
        res.data.forEach((item:any) => {
            songs.push({
                id: item.album_audio_id,
                name: item.audio_name,
                time: formatTime(item.timelength / 1000),
                album: {id: item.album_id, name: item.album_name, chl: CHL},
                singers: [{id: singer.id, name: item.author_name, chl: CHL}],
                chl: CHL
            })
        });
        return { songs };
    }

    // 通过歌手获得专辑
    static getAlbumsBySinger = async (singer: Singer, page: number) => {
        if (page !=1) {
            return { albums: [] }
        }
        const res = await get(`https://www.kugou.com/yy/?r=singer/album&sid=${singer.id}&p=1&t=1708780593820`, null) as any;
        let albums: Array<Album> = [];
        res.data.forEach((item:any) => {
            albums.push({
                id: item.albumid,
                name: item.albumname,
                img: item.img, // 封面
                time: item.publish_time,  // 发行时间
                singer: singer,
                chl: CHL
            })
        });
        return { albums };
    }

    // 专辑详情
    static getAlbumDetail = async (album: Album) => {
        const res = await get(`https://www.kugou.com/album/${album.id}.html`, null) as any;
        const parser = new DOMParser();
        const doc = parser.parseFromString(res, "text/html");
        const desc = doc.querySelector(".more_intro")?.textContent;
        const img = doc.querySelector(".alm2 .pic img")!.getAttribute("_src");
        const detailItems = doc.querySelector('.alm2 .detail')!.childNodes;
        const script = doc.querySelectorAll("script");
        let globalData = [] as any;
        script.forEach(s => {
            if(s.textContent!.includes("var data=")) {
                globalData = Function(s.textContent + ' return {data}')();
            }
        })
        let songs: Array<Song> = [];
        globalData.data.forEach((item:any) => {
            songs.push({
                id: item.album_audio_id,
                name: item.songname,
                time: formatTime(item.timelength / 1000),
                album: {id: item.album_id, name: item.album_name, chl: CHL},
                singers: item.authors.map((s: { author_id: any, author_name: any, sizable_avatar: any}) => ({id: s.author_id, name: s.author_name, img: s.sizable_avatar.replace("{size}", 240), chl: CHL})),
                chl: CHL,  // 渠道
            })
        });
        let albumDetail = {
            id: album.id,
            name: album.name,
            img: album.img || img, // 封面
            time: album.time || detailItems.item(12)?.textContent,  // 发行时间
            desc: desc,  // 描述
            singer: album.singer || songs[0].singers[0],  // 歌手
            songs: songs,
            chl: CHL
        };
        return { albumDetail };
    }

    // 所有歌手
    static getAllSingers = async () => {
        const allSingersHtml = await get('https://www.kugou.com/yy/html/singer.html', null) as any;
        const parser = new DOMParser();
        const doc = parser.parseFromString(allSingersHtml, "text/html");
        let categories: Record<string, Array<SingerCategory>> = {};
        // 组合分类
        let singerCategory: Array<SingerCategory> = [];
        const category = doc.querySelectorAll(".sng .l li");
        category.forEach((item: any) => {
            const regex = new RegExp(`all-(.*?){1}.html`);
            const match = item.querySelector("a").href.match(regex);
            if(item.querySelector("a").href.includes("all")) {
                singerCategory.push({
                    id: match[1],
                    name: item.querySelector("a").textContent,
                    chl: CHL
                })
            }else {
                singerCategory.push({
                    id: '1',
                    name: item.querySelector("a").textContent,
                    default: true,
                    chl: CHL
                })
            }
        })
        categories['category'] = singerCategory;
        // 字母分类
        let singerLetter: Array<SingerCategory> = [];
        const letter = doc.querySelectorAll(".num a");
        letter.forEach((item: any) => {
            const regex = new RegExp(`1-(.*?){1}-1.html`);
            const match = item.href.match(regex);
            if(item.href.includes("all")) {
                singerLetter.push({
                    id: match[1],
                    name: item.textContent,
                    default: true,
                    chl: CHL
                })
            }else {
                singerLetter.push({
                    id: match[1],
                    name: item.textContent,
                    chl: CHL
                })
            }
        })
        categories['letter'] = singerLetter;
        let singerSquare : SingerSquare = {categories: categories, chl: CHL};
        const list = doc.querySelectorAll("#list_head li");
        let singers: Array<Singer> = [];
        list.forEach((item: any) => {
            singers.push({
                id: '',
                name: item.querySelector('.pic').getAttribute("title"),
                img: item.querySelector('img').getAttribute("_src"),  // 封面
                data: {html: item.querySelector('.pic').getAttribute("href")},
                chl: CHL
            })
        })
        return { singerSquare, singers };
    }

    // 查询歌手
    static getSingersByTypes = async (data:any, page:number) => {
        if(page != 1) return { singers: []};
        const allSingersHtml = await get(`https://www.kugou.com/yy/singer/index/1-${data['letter']}-${data['category']}.html`, null) as any;
        const parser = new DOMParser();
        const doc = parser.parseFromString(allSingersHtml, "text/html");
        const list = doc.querySelectorAll("#list_head li");
        let singers: Array<Singer> = [];
        list.forEach((item: any) => {
            singers.push({
                id: '',
                name: item.querySelector('.pic').getAttribute("title"),
                img: item.querySelector('img').getAttribute("_src"),  // 封面
                data: {html: item.querySelector('.pic').getAttribute("href")},
                chl: CHL
            })
        })
        return { singers };
    }
}

const parseLyrics = (lyrics: string) => {
    if (!lyrics) return;
    if (lyrics.includes('[offset:0]')) {
        lyrics = lyrics.split('[offset:0]')[1]
    }else if (lyrics.includes('[00:00.00]')) {
        lyrics = lyrics.split('[00:00.00]')[1]
    }
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

const getParamsAndSign = (obj:any) => {
    obj['signature'] = md5(obj)
    return obj;
}

const md5 = (obj:Object) => {
    var sortedObj = Object.fromEntries(
        Object.entries(obj).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
    let s = jsonToKeyValueArray(sortedObj);
    s.push(KEY);
    s.unshift(KEY);
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
    return keyValuePairs;
}
