export interface Category {
    categoryGroupName: string,
    groupId: number
    items: Array<CategoryItem>,

}

export interface CategoryItem {
    categoryName:string,
    categoryId: number|string,
    default?: boolean,
}

export interface CategoriesDetail {
    categoriesDetailItem: Array<CategoriesDetailItem>,
    page?: page,
    data?: Record<string, any>
}
export interface CategoriesDetailItem {
    imgUrl: string,
    title: string,
    tid: number|string,
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
    img?: string,  // 封面
    data?: Record<string, any>
}

export interface musicList {
    tid: number|string,
    title: string,
    img: string,
    desc: string,
    updateTime?: string,
    list: Array<music>,
    data?: Record<string, any>
}

export interface page {
    page?: number,   // 当前页
    size?: number,   // 每页大小
    total?: number,  // 总数
    totalPage?: number,  // 总页数
    data?: Record<string, any>
}