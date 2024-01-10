// 对外暴露配置
export const routes = [
    {
        path: '/music',
        component: () => import('@/components/main/music/Home.vue'),
        name: 'music',
        redirect: '/qqmusic',
        meta: {
            title: '音乐平台',
        },
        children : [
            {
                path: '/qqmusic',
                name: 'qqmusic',
                component: () => import('@/components/main/music/layout/Category.vue'),
                meta: {
                    id: 1,
                    default: true,
                    title: 'QQ音乐',
                    type: "platform"
                },
            },
            {
                path: '/wyymusic',
                name: 'wyymusic',
                component: () => import('@/components/main/music/layout/Category.vue'),
                meta: {
                    id: 2,
                    title: '网易云音乐',
                    type: "platform"
                },
            },
            {
                path: '/kgmusic',
                name: 'kgmusic',
                component: () => import('@/components/main/music/layout/Category.vue'),
                meta: {
                    id: 3,
                    title: '酷狗音乐',
                    type: "platform"
                },
            },
            {
                path: '/categoryDetail',
                name: 'categoryDetail',
                component: () => import('@/components/main/music/layout/CategoryDetail.vue'),
                meta: {
                    title: '分类详情',
                },
            }
        ]
    }
]
