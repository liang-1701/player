// 对外暴露配置
export const routes = [
    {
        path: '/music',
        component: () => import('@/components/main/music/Home.vue'),
        name: 'music',
        redirect: '/category/1',
        meta: {
            title: '音乐',
        },
        children : [
            {
                path: '/category/:id',
                name: 'category',
                component: () => import('@/components/main/music/layout/Category.vue'),
                show: true,
                meta: {
                    title: '分类歌单',
                    platform: [
                        {
                            id: '1',
                            name: '网易云音乐',
                            file: 'wangyiyunmusic',
                        },
                        {
                            id: '2',
                            name: '酷狗音乐',
                            file: 'kugoumusic',
                        },
                        {
                            id: '3',
                            name: 'QQ音乐',
                            file: 'qqmusic',
                        },
                    ]
                },
            },
            {
                path: '/singer/:id',
                name: 'singer',
                component: () => import('@/components/main/music/layout/Singer.vue'),
                show: true,
                meta: {
                    title: '歌手详情',
                    platform: [
                        {
                            id: '1',
                            name: '网易云音乐',
                            file: 'wangyiyunmusic',
                            default: true
                        },
                        {
                            id: '2',
                            name: '酷狗音乐',
                            file: 'kugoumusic',
                            default: false
                        },
                        {
                            id: '3',
                            name: 'QQ音乐',
                            file: 'qqmusic',
                            default: false
                        },
                    ]
                },
            },
            {
                path: '/categoryDetail',
                name: 'categoryDetail',
                component: () => import('@/components/main/music/layout/CategoryDetail.vue'),
                meta: {
                    title: '分类详情歌曲列表',
                },
            }
        ]
    }
]
