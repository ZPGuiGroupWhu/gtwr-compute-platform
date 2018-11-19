// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/store'
import $ from 'jquery'
import VueResource from 'vue-resource'

import Vtip from 'vtip'
import 'vtip/lib/index.min.css'

Vue.use(VueResource)
Vue.use(Vtip.directive)// 注册指令使用
Vue.prototype.$tip = Vtip.tip// 工具函数调用
Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
})
