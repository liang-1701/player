// 分类
export interface Category {
    groupId: number
    name: string,
    categoryItems: Array<CategoryItem>,
    chl: number,  // 渠道
    data?: Record<string, any>
}

// 分类详情
export interface CategoryItem {
    categoryName:string,
    categoryId: number|string,
    default?: boolean,
    chl: number,  // 渠道
    data?: Record<string, any>
}

// 歌单广场
export interface Square {
    squareItems: Array<SquareItem>,
    page?: Page,
    chl: number,  // 渠道
    data?: Record<string, any>
}


// 歌单广场详细
export interface SquareItem {
    id: number|string,
    imgUrl: string,
    title: string,
    group: string,
    chl: number,  // 渠道
    data?: Record<string, any>
}

// 歌单内容
export interface SquareDetail {
    id: string|number,
    name: string,
    desc: string,
    img: string,
    updateTime?: string,
    songs: Array<Song>,
    chl: number,  // 渠道
    data?: Record<string, any>
}

// 歌曲详细
export interface Song {
    id: string|number,
    name: string,
    time: string
    album: Album,
    singers: Array<Singer>,
    playUrl?: string,  // 播放地址
    img?: string,  // 封面
    lyrics?: [{time:'',txt:''}],  // 歌词
    chl: number,  // 渠道
    data?: Record<string, any>
}

// 专辑
export interface Album {
    id: string|number,
    name: string,
    img?: string, // 封面
    time?: string,  // 发行时间
    desc?: string,  // 描述
    singer?: Singer,  // 歌手
    songs?: Array<Song>,
    chl: number,  // 渠道
    data?: Record<string, any>
}

// 歌手
export interface Singer {
    id: string,
    name: string,
    img?: string,  // 封面
    chl: number,  // 渠道
    data?: Record<string, any>
}

export interface SingerSquare {
    categories: Array<SingerCategory>,
    chl: number,  // 渠道
    data?: Record<string, any>
}

export interface SingerCategory {
    id: string,
    name: string,
    default?: boolean,
    chl: number,  // 渠道
    data?: Record<string, any>
}

export interface SingerDetail {
    id: string,
    name: string,
    img?: string,  // 封面
    songsTotal: number,  // 歌曲总数
    recommend?: Array<Song>,
    songs?: Array<Song>,
    chl: number,  // 渠道
    albums?: Array<Album>,
}

export interface Page {
    page?: number,   // 当前页
    size?: number,   // 每页大小
    total?: number,  // 总数
    totalPage?: number,  // 总页数
    data?: Record<string, any>
}