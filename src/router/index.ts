// 配置路由
import { createRouter, createWebHashHistory } from 'vue-router';

const routerFiles = import.meta.glob<JSON>("./modules/*.ts", { eager: true });


const routess = []

for (const file in routerFiles) {
    if (Object.prototype.hasOwnProperty.call(routerFiles, file)) {
        routess.push(...routerFiles[file].routes)
    }
}


// 创建路由器
let router = createRouter({
    history: createWebHashHistory(),
    routes: routess
})

export default router;