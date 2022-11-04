import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router/index'  
import Axios from './plugnis/axios.js'
import VueCookies from 'vue-cookies'
import locale from 'element-plus/lib/locale/lang/zh-cn'


const app=createApp(App)

app.config.globalProperties.$serverUrl = 'http://127.0.0.1:9000'

app.use(ElementPlus,{locale}).use(router).use(Axios).mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.config.globalProperties.$cookies = VueCookies