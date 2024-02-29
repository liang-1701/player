export interface Category {
    categoryGroupName: string,
    groupId: number
    items: Array<CategoryItem>,

}

export interface CategoryItem {
    categoryName:string,
    categoryId: number,
}

export interface CategoriesDetailItem {
    imgUrl: string,
    title: string,
    tid: number,
    group: string,
    data?: Record<string, any>
}

export interface singer {
    mid: string,
    name: string,
}

export interface music {
    index?: number,  // 列表索引
    mid: string,
    name: string,
    time: string
    album: {
        mid: string,
        name: string,
    },
    singer: Array<singer>,
    playUrl?: string,  // 播放地址
    data?: Record<string, any>
}

export interface musicList {
    tid: number,
    title: string,
    img: string,
    desc: string,
    updateTime?: string,
    list: Array<music>,
    data?: Record<string, any>
}
