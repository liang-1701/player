import { createApp } from "vue";
import Lyric from "./components/main/music/lyric/Lyric.vue";
import "normalize.css";
import "@/css/font.scss";
import '@/css/theme.scss'
import '@/css/global.scss'
import "element-plus/dist/index.css";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn.mjs";
import { createPinia } from 'pinia'
// import router from './router'
// import VueLazyLoad from "vue3-lazyload";
// import error from '@/assets/imgs/error.png';
import '@icon-park/vue-next/styles/index.css';

const app = createApp(Lyric);
app.use(ElementPlus, { locale: zhCn });
app.use(createPinia());
// app.use(router);
// app.use(VueLazyLoad, {
//     error: error,
// });
app.mount("#lyric");
