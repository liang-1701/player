import { Category, CategoryItem, Square, SquareItem, SquareDetail, Song, SingerDetail, Album, Singer, SingerSquare, SingerCategory } from "@/type/musicTypes";
import { formatTime, nextInt } from '@/common/utils'
import { post, get } from "@/common/http";
import CryptoJS from 'crypto-js';

const BASE_URL = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
const CHL = 3

export class QQMusicApi {

    // 推荐歌单
    static async getRecommend() {
        const data = {
            "comm": {
                "cv": 4747474,
                "ct": 24,
                "format": "json",
                "inCharset": "utf-8",
                "outCharset": "utf-8",
                "notice": 0,
                "platform": "yqq.json",
                "needNewCode": 1,
                "uin": 0,
                "g_tk_new_20200303": 5381,
                "g_tk": 5381
            },
            "req_1": {
                "method": "GetRecommendWhole",
                "module": "music.playlist.PlaylistSquare",
                "param": {
                    "IsReqFeed": true,
                    "FeedReq": {
                        "From": 0,
                        "Size": 40
                    }
                }
            }
        }
        const res = await post(BASE_URL, data, null, null) as any;
        let items: SquareItem[] = [];
        (res as any).req_1.data.FeedRsp.List.forEach((item:any) => {
            const el = item.Playlist.basic;
            const squareItem : SquareItem = {
                id: el.tid,
                imgUrl: el.cover.default_url,
                title: el.title,
                group: "other",
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

    // 全部分类
    static getCategory = async () => {
        let categories: Array<Category> = [];
        let categoriesDetail: Array<CategoryItem> = [];
        const data = {
            "req_1": {
                "module": "music.playlist.PlaylistSquare",
                "method": "GetAllTag",
                "param": {
                    "qq": ""
                }
            },
            "comm": {
                "g_tk": 5381,
                "uin": "0",
                "format": "json",
                "ct": 6,
                "cv": 80605,
                "platform": "wk_v17",
                "uid": "5019772269",
                "guid": "2057708153c9fc13f0e801c14d39af5fccdfdc60",
                "mesh_devops": "DevopsBase"
            }
        }
        const res = await post(BASE_URL, data, null, null) as any;
        res.req_1.data.v_group.forEach((item: any) => {
            const items: Array<CategoryItem> = [];
            item.v_item.forEach((el:any) => {
                if("AI歌单" == el.name) return;
                const categoryItem = {
                    categoryName: el.name,
                    categoryId: el.id,
                    chl: CHL
                }
                categoriesDetail.push(categoryItem);
                items.push(categoryItem);
            });
            categories.push({
                groupId: item.group_id,
                name: item.group_name,
                categoryItems: items,
                chl: CHL
            })
        })
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
        const pageSize = 35;
        if ("top" == id) {
            return { square: (await this.getTop()).square };
        }
        if (id == 0) {
            return { square: (await this.getRecommend()).square };
        }
        const data = {
            req_1: {
                module: "playlist.PlayListCategoryServer",
                method: "get_category_content",
                param: {
                    caller: "0",
                    category_id: id,
                    page: (page - 1),
                    use_page: 1,
                    size: pageSize
                }
            }
        }
        const res = await post(BASE_URL, data, null, null) as any;
        let items: SquareItem[] = [];
        res.req_1.data.content.v_item.forEach((item:any) => {
            const squareItem : SquareItem = {
                id: item.basic.tid,
                imgUrl: item.basic.cover.default_url,
                title: item.basic.title,
                group: "other",
                chl: CHL
            }
            items.push(squareItem);
        });
        let square: Square = {
            squareItems: items,
            chl: CHL
        };
        if(res.req_1.data.content.total_cnt) {
            const page = {
                size: pageSize,   // 每页大小
                total: res.req_1.data.content.total_cnt,  // 总数
            }
            square.page = page;
        }
        return { square };
    }

    // 获取排行榜内容
    static getTop = async () => {
        const params = {
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
        const res = await get(BASE_URL, params) as any;
        let items: SquareItem[] = [];
        res.req_1.data.group.forEach((item:any) => {
            item.toplist.forEach((el:any) => {
                const squareItem : SquareItem = {
                    id: el.topId,
                    imgUrl: el.frontPicUrl,
                    title: el.title,
                    group: "top",
                    chl: CHL,
                    data: {
                        period: el.period,
                    }
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
        if ("top" == group) {
            return { squareDetail: (await this.getTopList(id, data)).squareDetail };
        }
        const reqBody = {
            "req_0": {
                "module": "music.srfDissInfo.aiDissInfo",
                "method": "uniform_get_Dissinfo",
                "param": {
                "disstid": id,
                "userinfo": 1,
                "tag": 1,
                "is_pc": 1,
                "guid": "AE5C5AFDB0D1F69DC4D50AF54E2054B6"
                }
            },
            "comm": {
                "g_tk": 5381,
                "uin": 0,
                "format": "json",
                "ct": 20,
                "cv": 1957,
                "platform": "wk_v17",
                "uid": "5238907661",
                "guid": "AE5C5AFDB0D1F69DC4D50AF54E2054B6"
            }
        }
        const res = await post(BASE_URL, reqBody, null, null) as any;
        let songs: Array<Song> = [];
        res.req_0.data.songlist.forEach((item:any) => {
            songs.push({
                id: item.mid,
                name: item.name,
                time: formatTime(item.interval),
                album: {id: item.album.mid, name: item.album.name, chl: CHL},
                singers: item.singer.map((s: { mid: any, name: any}) => ({id: s.mid, name: s.name, chl: CHL})),
                img: `https://y.qq.com/music/photo_new/T002R300x300M000${item.album.mid}.jpg?max_age=2592000`,
                chl: CHL
            })
        })
        let squareDetail: SquareDetail = {
            id: res.req_0.data.dirinfo.id,
            name: res.req_0.data.dirinfo.title,
            desc: res.req_0.data.dirinfo.desc,
            img: res.req_0.data.dirinfo.picurl,
            songs: songs,
            chl: CHL
        };
        return { squareDetail }
    }
    
    // 获得当前排行榜内容
    static getTopList = async (id: number|string, data: any) => {
        const params = {
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
        const res = await get(BASE_URL, params) as any;
        let songs: Array<Song> = [];
        res.req_1.data.songInfoList.forEach((item:any) => {
            songs.push({
                id: item.mid,
                name: item.name,
                time: formatTime(item.interval),
                album: {id: item.album.mid, name: item.album.name, chl: CHL},
                singers: item.singer.map((s: { mid: any, name: any}) => ({id: s.mid, name: s.name, chl: CHL})),
                img: `https://y.qq.com/music/photo_new/T002R300x300M000${item.album.mid}.jpg?max_age=2592000`,
                chl: CHL
            })
        })
        let squareDetail: SquareDetail = {
            id: res.req_1.data.data.topId,
            name: res.req_1.data.data.title,
            desc: res.req_1.data.data.intro,
            updateTime: res.req_1.data.data.updateTime,
            img: res.req_1.data.data.frontPicUrl || res.req_1.data.data.headPicUrl,
            songs: songs,
            chl: CHL
        };
        return { squareDetail }
    }

    static getSongDetail = async (song: Song) => {
        const data = {
            "comm": {
                "cv": 4747474,
                "ct": 24,
                "format": "json",
                "inCharset": "utf-8",
                "outCharset": "utf-8",
                "notice": 0,
                "platform": "yqq.json",
                "needNewCode": 1,
                "uin": 0,
                "g_tk_new_20200303": 5381,
                "g_tk": 5381
            },
            "req_1": {
                "module": "music.musichallSong.PlayLyricInfo",
                "method": "GetPlayLyricInfo",
                "param": {
                "songMID": song.id,
                // "songID": 473931353
                }
            },
            "req_2": {
                "module": "vkey.GetVkeyServer",
                "method": "CgiGetVkey",
                "param": {
                    guid: nextInt(10000000).toFixed(0),
                    "songmid": [
                        song.id
                    ],
                    "songtype": [
                        0
                    ],
                    "uin": "0",
                    "loginflag": 1,
                    "platform": "20",
                    "filename": [
                        `RS02${song.id}.mp3`
                        // filename: [`${item.prefix}${res.req_1.data.track_info.mid}${res.req_1.data.track_info.mid}${item.ext}`],
                    ]
                }
            }
        }
        const res = await post(BASE_URL, data, null, null) as any;
        const sip = res.req_2.data.sip[0];
        const purl = res.req_2.data.midurlinfo[0].purl;
        const playUrl = `${sip}${purl}`;
        song.lyrics = parseLyrics(res.req_1.data.lyric);
        return { playUrl }
    }
    
    // 歌曲搜索
    static searchSongs = async (keyword: string, page: number) => {
        const pageSize = 30;
        const data = {
            "comm": {
                "ct": "6",
                "cv": "80500"
            },
            "req_1": {
                "module": "music.search.SearchCgiService",
                "method": "DoSearchForQQMusicDesktop",
                "param": {
                    "num_per_page": pageSize,
                    "page_num": page,
                    "query": keyword,
                    "search_type": 0,
                    "grp": 1
                }
            }
        }
        const res = await post(BASE_URL, data, null, null) as any;
        let songs: Array<Song> = [];
        res.req_1.data.body.song.list.forEach((item:any) => {
            songs.push({
                id: item.mid,
                name: item.name,
                time: formatTime(item.interval),
                album: {id: item.album.mid, name: item.album.name, chl: CHL},
                singers: item.singer.map((s: { mid: any, name: any}) => ({id: s.mid, name: s.name, chl: CHL})),
                img: `https://y.qq.com/music/photo_new/T002R300x300M000${item.album.mid}.jpg?max_age=2592000`,
                chl: CHL
            })
        });
        return { songs };
        
    }

    // 歌单搜索
    static searchSpecials = async (keyword: string, page: number) => {
        const pageSize = 30;
        const data = {
            "comm": {
                "ct": "6",
                "cv": "80500"
            },
            "req_1": {
                "module": "music.search.SearchCgiService",
                "method": "DoSearchForQQMusicDesktop",
                "param": {
                    "num_per_page": pageSize,
                    "page_num": page,
                    "query": keyword,
                    "search_type": 3,
                    "grp": 1
                }
            }
        }
        const res = await post(BASE_URL, data, null, null) as any;
        let specials: Array<SquareItem> = [];
        res.req_1.data.body.songlist.list.forEach((item:any) => {
            const squareItem : SquareItem = {
                id: Number(item.dissid),
                imgUrl: item.imgurl,
                title: item.dissname,
                group: "other",
                chl: CHL
            }
            specials.push(squareItem);
        });
        return { specials };
        
    }

    // 歌手搜索
    static searchSingers = async (keyword: string, page: number) => {
        const pageSize = 30;
        const data = {
            "comm": {
                "ct": "6",
                "cv": "80500"
            },
            "req_1": {
                "module": "music.search.SearchCgiService",
                "method": "DoSearchForQQMusicDesktop",
                "param": {
                    "num_per_page": pageSize,
                    "page_num": page,
                    "query": keyword,
                    "search_type": 1,
                    "grp": 1
                }
            }
        }
        const res = await post(BASE_URL, data, null, null) as any;
        let singers: Array<Singer> = [];
        res.req_1.data.body.singer.list.forEach((item:any) => {
            const singer : Singer = {
                id: item.singerMid,
                name: item.singerName,
                img: item.singerPic,  // 封面
                chl: CHL
            }
            singers.push(singer);
        });
        return { singers };
        
    }

    // 专辑搜索
    static searchAlbums = async (keyword: string, page: number) => {
        const pageSize = 30;
        const data = {
            "comm": {
                "ct": "6",
                "cv": "80500"
            },
            "req_1": {
                "module": "music.search.SearchCgiService",
                "method": "DoSearchForQQMusicDesktop",
                "param": {
                    "num_per_page": pageSize,
                    "page_num": page,
                    "query": keyword,
                    "search_type": 2,
                    "grp": 1
                }
            }
        }
        const res = await post(BASE_URL, data, null, null) as any;
        let albums: Array<Album> = [];
        res.req_1.data.body.album.list.forEach((item:any) => {
            const album : Album = {
                id: item.albumMid,
                name: item.albumName,
                img: item.albumPic, // 封面
                time: item.publicTime,  // 发行时间
                singer: item.singer_list.map((s: { mid: any, name: any}) => ({id: s.mid, name: s.name, chl: CHL})),
                chl: CHL
            }
            albums.push(album);
        });
        return { albums };
        
    }
    
    // 歌手详情
    static getSingerDetail = async (singer: Singer, page: number) => {
        const pageSize = 30;
        const data = {
            "comm": {
                "cv": 4747474,
                "ct": 24,
                "format": "json",
                "inCharset": "utf-8",
                "outCharset": "utf-8",
                "notice": 0,
                "platform": "yqq.json",
                "needNewCode": 1,
                "uin": 0,
                "g_tk_new_20200303": 5381,
                "g_tk": 5381
            },
            "req_0": {
                "module": "music.musichallSinger.SingerInfoInter",
                "method": "GetSingerDetail",
                "param": {
                    "singer_mids": [
                        singer.id
                    ],
                    "pic": 1,
                    "group_singer": 1,
                    "wiki_singer": 1,
                    "ex_singer": 1
                }
            },
            "req_1": {
                "module": "music.musichallSong.SongListInter",
                "method": "GetSingerSongList",
                "param": {
                    "singerMid": singer.id,
                    "begin": pageSize * (page - 1),
                    "num": pageSize,
                    "order": 1
                }
            }
        }       
        const res = await post(BASE_URL, data, null, null) as any;
        singer.img = res.req_0.data.singer_list[0].pic.pic;
        let recommend: Array<Song> = [];
        res.req_1.data.songList.forEach((item:any) => {
            const songInfo = item.songInfo;
            recommend.push({
                id: songInfo.mid,
                name: songInfo.name,
                time: formatTime(songInfo.interval),
                album: {id: songInfo.album.mid, name: songInfo.album.name, chl: CHL},
                singers: songInfo.singer.map((s: { mid: any, name: any}) => ({id: s.mid, name: s.name, chl: CHL})),
                chl: CHL
            })
        });
        let singerDetail: SingerDetail = {
            id: singer.id,
            name: singer.name,
            img: singer.img,
            songsTotal: res.req_1.data.totalNum,
            recommend: recommend,
            chl: CHL
        };
        return { singerDetail };
    }

    // 通过歌手获得歌曲
    static getSongsBySinger = async (singer: Singer, page: number) => {
        const pageSize = 30;
        const data = {
            "comm": {
                "cv": 4747474,
                "ct": 24,
                "format": "json",
                "inCharset": "utf-8",
                "outCharset": "utf-8",
                "notice": 0,
                "platform": "yqq.json",
                "needNewCode": 1,
                "uin": 0,
                "g_tk_new_20200303": 5381,
                "g_tk": 5381
            },
            "req_1": {
                "module": "music.musichallSong.SongListInter",
                "method": "GetSingerSongList",
                "param": {
                    "singerMid": singer.id,
                    "begin": pageSize * (page - 1),
                    "num": pageSize,
                    "order": 1
                }
            }
        }       
        const res = await post(BASE_URL, data, null, null) as any;
        let songs: Array<Song> = [];
        res.req_1.data.songList.forEach((item:any) => {
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
        return { songs };
    }

    // 通过歌手获得专辑
    static getAlbumsBySinger = async (singer: Singer, page: number) => {
        const pageSize = 30;
        const data = {
            "comm": {
                "cv": 4747474,
                "ct": 24,
                "format": "json",
                "inCharset": "utf-8",
                "outCharset": "utf-8",
                "notice": 0,
                "platform": "yqq.json",
                "needNewCode": 1,
                "uin": 0,
                "g_tk_new_20200303": 5381,
                "g_tk": 5381
            },
            "req_1": {
                "module": "music.musichallAlbum.AlbumListServer",
                "method": "GetAlbumList",
                "param": {
                    "singerMid": singer.id,
                    "begin": pageSize * (page - 1),
                    "num": pageSize,
                    "order": 1
                }
            }
        }       
        const res = await post(BASE_URL, data, null, null) as any;
        let albums: Array<Album> = [];
        res.req_1.data.albumList.forEach((item:any) => {
            albums.push({
                id: item.albumMid,
                name: item.albumName,
                img: `https://y.qq.com/music/photo_new/T002R300x300M000${item.pmid}.jpg?max_age=2592000`, // 封面
                time: item.publishDate,  // 发行时间
                singer: singer,
                chl: CHL
            })
        });
        return { albums };
    }

    // 专辑详情
    static getAlbumDetail = async (album: Album) => {
        const data = {
            "comm": {
                "cv": 4747474,
                "ct": 24,
                "format": "json",
                "inCharset": "utf-8",
                "outCharset": "utf-8",
                "notice": 0,
                "platform": "yqq.json",
                "needNewCode": 1,
                "uin": 0,
                "g_tk_new_20200303": 5381,
                "g_tk": 5381
            },
            "req_1": {
                "module": "music.musichallAlbum.AlbumInfoServer",
                "method": "GetAlbumDetail",
                "param": {
                    "albumMid": album.id
                }
            },
                "req_2": {
                "module": "music.musichallAlbum.AlbumSongList",
                "method": "GetAlbumSongList",
                "param": {
                    "albumMid": album.id,
                    "begin": 0,
                    "num": 60,
                    "order": 2
                }
            }
        }       
        const res = await post(BASE_URL, data, null, null) as any;
        let songs: Array<Song> = [];
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
        const basicInfo = res.req_1.data.basicInfo;
        let albumDetail = {
            id: album.id,
            name: album.name,
            img: album.img || `https://y.qq.com/music/photo_new/T002R300x300M000${basicInfo.pmid}.jpg?max_age=2592000`,  // 封面
            time: album.time || basicInfo.publishDate,  // 发行时间
            desc: basicInfo.desc,  // 描述
            singer: album.singer || songs[0].singers[0],  // 歌手
            songs: songs,
            chl: CHL
        };
        return { albumDetail };
    }

    // 所有歌手
    static getAllSingers = async () => {
        const data = {
            "req_0": {
                "module": "music.musichallSinger.SingerList",
                "method": "GetSingerListIndex",
                "param": {
                    "area": -100,
                    "sex": -100,
                    "index": -100,
                    "genre": -100,
                    "cur_page": 1,
                    "sin": 0
                }
            },
            "comm": {
                "g_tk": 159249210,
                "uin": "1152921504780534770",
                "format": "json",
                "ct": 20,
                "cv": 1957,
                "platform": "wk_v17",
                "uid": "5238907661",
                "guid": "AE5C5AFDB0D1F69DC4D50AF54E2054B6"
            }
        }     
        const res = await post(BASE_URL, data, null, null) as any;
        let categories: Record<string, Array<SingerCategory>> = {};
        Object.entries(res.req_0.data.tags).forEach(([key, value]) => {
            let singerCategory: Array<SingerCategory> = [];
            (value as any).forEach((el:any) => {
                if(el.name == '全部'){
                    singerCategory.push({
                        id: el.id,
                        name: el.name,
                        default: true,
                        chl: CHL
                    })
                }else {
                    singerCategory.push({
                        id: el.id,
                        name: el.name,
                        chl: CHL
                    })
                }
            });
            categories[key] = singerCategory;
        })
        let singerSquare : SingerSquare = {categories: categories, chl: CHL};
        let singers: Array<Singer> = [];
        res.req_0.data.singerlist.forEach((item: any) => {
            singers.push({
                id: item.singer_mid,
                name: item.singer_name,
                img: item.singer_pic,  // 封面
                chl: CHL
            })
        })
        return { singerSquare, singers };
    }

    // 查询歌手
    static getSingersByTypes = async (data:any, page:number) => {
        const reqBody = {
            "req_0": {
                "module": "music.musichallSinger.SingerList",
                "method": "GetSingerListIndex",
                "param": {
                    "area": data["area"],
                    "sex": data["sex"],
                    "index": data["index"],
                    "genre": data["genre"],
                    "cur_page": page,
                    "sin": 80 * (page - 1)
                }
            },
            "comm": {
                "g_tk": 159249210,
                "uin": "1152921504780534770",
                "format": "json",
                "ct": 20,
                "cv": 1957,
                "platform": "wk_v17",
                "uid": "5238907661",
                "guid": "AE5C5AFDB0D1F69DC4D50AF54E2054B6"
            }
        }     
        const res = await post(BASE_URL, reqBody, null, null) as any;
        let singers: Array<Singer> = [];
        res.req_0.data.singerlist.forEach((item: any) => {
            singers.push({
                id: item.singer_mid,
                name: item.singer_name,
                img: item.singer_pic,  // 封面
                chl: CHL
            })
        })
        return { singers };
    }
}

const parseLyrics = (data: string) => {
    if (!data) return;
    let lyrics = CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8);
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
