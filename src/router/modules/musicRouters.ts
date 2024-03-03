// 对外暴露配置
export const routes = [
    {
        path: '/music',
        component: () => import('@/components/main/music/Home.vue'),
        name: 'music',
        redirect: '/square/2',
        meta: {
            title: '音乐',
        },
        children : [
            {
                path: '/square/:id',
                name: 'square',
                component: () => import('@/components/main/music/layout/Square.vue'),
                show: true,
                meta: {
                    title: '歌单广场',
                    platform: [
                        {
                            id: '1',
                            name: '网易云音乐',
                            file: 'wangyiyun',
                        },
                        {
                            id: '2',
                            name: '酷狗音乐',
                            file: 'kugou',
                        },
                        {
                            id: '3',
                            name: 'QQ音乐',
                            file: 'qq',
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
                            file: 'wangyiyun',
                        },
                        {
                            id: '2',
                            name: '酷狗音乐',
                            file: 'kugou',
                        },
                        {
                            id: '3',
                            name: 'QQ音乐',
                            file: 'qq',
                        },
                    ]
                },
            },
            {
                path: '/squareDetail',
                name: 'squareDetail',
                component: () => import('@/components/main/music/layout/SquareDetail.vue'),
                meta: {
                    title: '分类详情歌曲列表',
                },
            },
            {
                path: '/singerDetail',
                name: 'singerDetail',
                component: () => import('@/components/main/music/layout/SingerDetail.vue'),
                meta: {
                    title: '歌手详情',
                },
            },
            {
                path: '/albumDetail',
                name: 'albumDetail',
                component: () => import('@/components/main/music/layout/AlbumDetail.vue'),
                meta: {
                    title: '专辑详情',
                },
            },
            {
                path: '/searchMusic',
                name: 'searchMusic',
                component: () => import('@/components/main/music/layout/SearchMusic.vue'),
                meta: {
                    title: '搜索',
                },
                
            }
        ]
    }
]
