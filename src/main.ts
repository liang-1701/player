import { createApp } from "vue";
import App from "./App.vue";
import "normalize.css";
import '@/css/theme.scss'
import '@/css/global.scss'
import "element-plus/dist/index.css";
import 'element-plus/theme-chalk/dark/css-vars.css'
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn.mjs";
import { createPinia } from 'pinia'
import router from './router'
import VueLazyLoad from "vue3-lazyload";
import '@/common/request' 

const app = createApp(App);
// app.config.globalProperties.$global = global
app.use(ElementPlus, { locale: zhCn });
app.use(createPinia());
app.use(router);
app.use(VueLazyLoad, {
    error: "error.png"
});
app.mount("#app");
