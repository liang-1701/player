import axios from "axios";
import { ElLoading } from 'element-plus'

let loading: any;

// request添加拦截器
axios.interceptors.request.use(
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
axios.interceptors.response.use(
    (response) => {
        loading.close();
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);