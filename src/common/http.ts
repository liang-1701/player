import request from './request';
import qs from "qs";

export const get = (url: string, params:any) => {
    return new Promise((resolve, reject) => {
        if (params && (typeof (params) === 'object')) {
            params = qs.stringify(params);
            url = url.includes('?') ? url : url + '?';
            url = url.endsWith('?') ? (url + params) : (url + "&" + params);
        }
        request.get(url).then((resp) => {
            if (resp.status === 200) {
                resolve(resp.data);
            }else {
                reject("请求失败");
            }
        }).catch((error: any) => reject(error));
    })
}

export const post = (url: string, data:any, params:any) => {
    return new Promise((resolve, reject) => {
        request.post(url, data, {params: params}).then(resp => {
            if (resp.status === 200) {
                resolve(resp.data);
            }else {
                reject("请求失败");
            }
        }).catch(error => reject(error))
    })
}