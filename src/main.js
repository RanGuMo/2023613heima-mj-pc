import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 修改主题色
import '@/styles/index.scss'
// 引入封装好的element模块，没有返回对象，也不需要用到返回的对象，只需要让它执行js即可
import '@/utils/element'
// 完整引入
// import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'

// Vue.use(ElementUI)

// 按需引入
// import { Button } from 'element-ui'
// Vue.use(Button)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
