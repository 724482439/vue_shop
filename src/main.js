import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import router from './router'
// 导入全局样式表
import './assets/css/global.css'

// 引入axios，并将其挂载在vue的原型对象上
import axios from 'axios'
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
