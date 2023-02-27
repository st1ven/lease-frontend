
import Vue from 'vue'
import App from './App'
// #ifdef MP-ALIPAY
import uma from 'umtrack-alipay';
uma.init({
    appKey:'6369f21d88ccdf4b7e606f18',
    debug:false 
});
my.onPageNotFound(res => {
  my.switchTab({
    url: '/pages/index/index'
  });
});
uma.install =function(Vue){
Vue.prototype.$uma = uma
}
Vue.use(uma)
// #endif


// vuex
import store from './store'

// 引入全局uView
import uView from '@/uni_modules/uview-ui'

import mixin from './common/mixin'
import {$request,unique,$UploadFile} from 'common/request.js'


Vue.prototype.$store = store
// Vue.prototype.$https = "https://mebilelease.com" //默认环境
Vue.prototype.$request = $request
Vue.prototype.$unique = unique
Vue.prototype.$UploadFile = $UploadFile

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)

// #ifdef MP
// 引入uView对小程序分享的mixin封装
const mpShare = require('@/uni_modules/uview-ui/libs/mixin/mpShare.js')
Vue.mixin(mpShare)
// #endif

Vue.mixin(mixin)

const app = new Vue({
	store,
	...App
})

// 引入请求封装
require('./util/request/index')(app)

app.$mount()
