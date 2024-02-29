// 对外暴露配置
export const routes = [
        {
            path: '/',
            name: 'home',
            redirect: '/music',
            meta: {
                title: '首页',
            }
        },
        {
            path: '/setting',
            component: () => import('@/components/main/Setting.vue'),
            name: 'setting',
            meta: {
                title: '设置',
            }
        },
        {
            path: '/musicList',
            name: 'musicList',
            meta: {
                title: '音乐列表',
            }
        },
    ]
    