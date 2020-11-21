import Vue from 'vue'

import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'
import vantConfig from './vant.config.js'


import 'lib-flexible/flexible'

import { Toast, Notify, Dialog } from 'vant'

Vue
   .use(Toast)
   .use(Notify)
   .use(Dialog)

//注册axios, ajax方案, 用于请求数据
Vue.use(VueAxios, axios)

//设置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002'

//设置post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

// 使用Vue 插件语法将按需引入的Vant组件全局注册到Vue中
Vue.use(vantConfig)

Vue.config.productionTip = false

//添加一个Vue原型属性
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

//全局注册过滤器, 一般用于格式化数据
Vue.filter('formatDate', (value, format) => {
  //value: 需要格式化的数据
  //format: 指定格式 yyyy-MM-dd hh:mm:ss

  
  let date = new Date(value)

  //获取年份
  let year = date.getFullYear();
  //  

  if (/(y+)/.test(format)) {
    //获取匹配组的内容
    let content = RegExp.$1;
    //  
    format = format.replace(content, year.toString().slice(4 - content.length))

    //  
  }

  let o = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds(),
  }

  for(let key in o) {
    //构造动态正则
    let reg = new RegExp(`(${key}+)`);
    //  
    if (reg.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1
      //  
      let k = o[key] >= 10 ? o[key] : content.length == 2 ? '0' + o[key] : o[key]
      format = format.replace(content, k)
      //  
    }
  }

  return format;

})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
