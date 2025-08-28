import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import pinia from './store';
import { useAppStore } from './store/modules/app';
import SvgIcon from './components/common/SvgIcon.vue';
import 'virtual:svg-icons-register';

const app = createApp(App);

// 全局注册组件
app.component('SvgIcon', SvgIcon);

// 安装插件
app.use(router);
app.use(pinia);

// 初始化应用状态
const appStore = useAppStore();
appStore.initTheme();

app.mount('#app');
