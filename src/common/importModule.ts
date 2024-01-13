export const importAndExtract = async (filename: string, methodname: string) => {
    // 导入文件
    const importModule = await import(/* @vite-ignore */filename);
    // 解构方法
    if(methodname in importModule && typeof importModule[methodname] === 'function') {
        const methodToCall = importModule[methodname];
        return methodToCall;
    }else {
        throw new Error(`Method ${methodname} not found in ${filename}`);
    }
}