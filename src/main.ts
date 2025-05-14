import { createApp } from 'vue'
import './css/tailwind.css'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import { setupDirectives } from './directives'

const app = createApp(App)
const pinia = createPinia();
pinia.use(createPersistedState());

app.use(pinia);
app.use(router)
app.use(Antd)

// 注册自定义指令
setupDirectives(app)

app.mount('#app')