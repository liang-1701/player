// export const importAndExtract = async (filename: string, methodname: string) => {
//     // 导入文件
//     const importModule = await import(/* @vite-ignore */filename);
//     // 解构方法
//     if(methodname in importModule && typeof importModule[methodname] === 'function') {
//         const methodToCall = importModule[methodname];
//         return methodToCall;
//     }else {
//         throw new Error(`Method ${methodname} not found in ${filename}`);
//     }
// }

export const getClassName = async (type: string, methodname: string)=> {
    switch(type) {
        case 'wangyiyun':{
            const importModule = await import('@/platform/music/wangyiyun');
            const men = methodname as keyof typeof importModule.WangYiYunMusicApi;
            const res = importModule.WangYiYunMusicApi[men] as Function
            return res;
        }
        case 'kugou':{
            const importModule = await import('@/platform/music/kugou');
            const men = methodname as keyof typeof importModule.KuGouMusicApi;
            const res = importModule.KuGouMusicApi[men] as Function
            return res;
        }
        case 'qq':{
            const importModule = await import('@/platform/music/qq');
            const men = methodname as keyof typeof importModule.QQMusicApi;
            const res = importModule.QQMusicApi[men] as Function
            return res;
        }
    }
}