import Vue from 'vue'

Vue.config.productionTip = false

import store from '@/store'
import {
    Indicator,
} from 'mint-ui'


// 所有的自定义添加在vue 原型链上的方法, 统一 用 "$_"开头意做区分
// 操作提示方法
Vue.prototype.$_showtip = function (msg, statuType = "success", isFromApp = false) {
    Indicator.close();
    store.dispatch('SET_ACTION_STATU', {
        'type': statuType,
        'message': msg,
        'isFromApp': isFromApp
    })
}

// api 处理数据请求
import api from '@/services/api'
Vue.prototype.$_api = api

// cookie操作
import cookie from '@/services/cookie'
Vue.prototype.$_cookie = cookie

// 社交平台操作
import social from '@/services/social'
Vue.prototype.$_social = social

// 全局配置信息
const ua = window.navigator.userAgent.toLowerCase()
console.log(ua)
var isWechat = false

// platform平台分为 web ,web_andorid, web_ios, web_wechat , smi_ios ,smi_android 
var isSmiApp = false  // 是否为大星美的app
var platform = 'web'  // 默认为普通web
if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    isWechat = true
    store.dispatch('SET_IS_WECHAT', true)
    platform = 'web_wechat'
    social.init()
}
if(ua.match(/iphone/i) == 'iphone'){
    // platform = 'ios'
    platform = 'web_ios'
}
if(ua.match(/android/i) == 'android'){
    // platform = 'android'
    platform = 'web_android'
}
if (ua.match(/SMI_IOS/i) == 'smi_ios') {
    isSmiApp = true
    platform = 'smi_ios'
    store.dispatch('SET_IS_APP', true)
}
if (ua.match(/SMI_ANDROID/i) == 'smi_android') {
    isSmiApp = true
    platform = 'smi_android'
    store.dispatch('SET_IS_APP', true)
}
console.log(platform)

Vue.prototype.$_config = {
    'isWechat': isWechat,
    'isSmiApp': isSmiApp,
    'baiduKey':'rSc0WmydyBgO1QM99nFiZMKBpt5KOm2i',
    'platform':platform
}
window.app_config =  {
    'isWechat': isWechat,
    'isSmiApp': isSmiApp,
    'baiduKey':'rSc0WmydyBgO1QM99nFiZMKBpt5KOm2i',
    'platform':platform
}

// Vue.mixin({
//   mounted() {
//     console.log('hello from mixin!')
//   }
// })