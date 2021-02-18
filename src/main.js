import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
// import { config } from 'vue/types/umd'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// loding进度条
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  // 请求拦截器使用进度条
  Nprogress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use(config => {
  Nprogress.done()
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
Vue.filter('dateFormat', function (value) {
  const date = new Date(value)
  const y = (date.getFullYear() + '').padStart(2, '0')
  const m = (date.getMonth() + '').padStart(2, '0')
  const d = (date.getDate() + '').padStart(2, '0')
  const h = (date.getHours() + '').padStart(2, '0')
  const mm = (date.getMinutes() + '').padStart(2, '0')
  const s = (date.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${mm}:${s}`
})
Vue.use(VueQuillEditor)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
