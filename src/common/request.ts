import axios from "axios";
import { ElLoading } from 'element-plus'

let loading: any;

let request = axios.create({
    timeout: 30000, // 超时时间
});

// request添加拦截器
request.interceptors.request.use(
    (config) => {
        loading = ElLoading.service({
            lock: true,
            text: '加载中, 请稍后...',
            background: 'rgba(0, 0, 0, 0.7)',
        })
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// response
request.interceptors.response.use(
    (response) => {
        loading.close();
        return response;
    },
    (error) => {
        loading.close();
        return Promise.reject(error);
    }
);

export default request;