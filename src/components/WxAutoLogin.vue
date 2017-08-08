<template>
  <div>
    <div v-if="debug">
      <ul>
        <li class="info-row">
          <b>openId:</b>
          <span>{{openid}}</span>
        </li>
        <li class="info-row" v-for="(item,key,index) in userinfo" :key="index">
          <b>{{key}}:</b>
          <span>{{item}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import {
//   WX_LOGIN_BASEURL,
//   WX_OPENID_BY_CODE
// } from '@/services/config'

// 第三方分享和登陆
var env = process.env.NODE_ENV
let wxLoginBaseUrl = '' // 微信获取自动登陆地址
let wxOpenidByCode = '' // 通过跳转 wxLoginBaseUrl 地址处理后返回地址中有code .利用code取得openid
if (env === 'development') {
  wxLoginBaseUrl = 'http://testsmi.assets.smi170.com/communication/wx/getWXCodeURLEncoder'
  wxOpenidByCode = 'http://testsmi.assets.smi170.com/communication/wx/getWXOpenid'
}
else if (env === 'production') {
  wxLoginBaseUrl = 'http://testsmi.assets.smi170.com/communication/wx/getWXCodeURLEncoder'
  wxOpenidByCode = 'http://testsmi.assets.smi170.com/communication/wx/getWXOpenid'
  // wxLoginBaseUrl = 'http://testmall.xingmeihui.com/smiweb/api/wx/getWXCode'
  // wxOpenidByCode = 'http://testmall.xingmeihui.com/smiweb/api/wx/getWXOpenid'
}
const WX_LOGIN_BASEURL = wxLoginBaseUrl
const WX_OPENID_BY_CODE = wxOpenidByCode

export default {
  props: [
    'loginNeed',  // 需要登录获取个人用户信息,否则只做openid存储
    'debug',   // 开启debug模式,可以展示当前openid, 个人信息等
  ],
  data() {
    return {
      'openid': '',
      'userinfo': {
      }
    }
  },
  mounted() {
    if (this.$_config.isWechat) {
      this.checkLogin();
    }
  },
  methods: {
    // 解析地址参数
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r != null) return unescape(r[2]); return null; //返回参数值
    },
    checkLogin() {
      /*
        0. 是否已经存在用户信息 => 已有用户信息,什么都不做
        1. cookie有openid => 直接通过openid获取个人信息
        2. 没有openid 
          - 2.1 => 用户未绑定卡=> 跳去账号登陆且绑定
          - 2.2 => 用户已绑定卡
            . 2.2.1 => 地址中有code ,通过code获取openid
            . 2.2.2 => 地址中没有code ,跳去账号登陆
      */
      var userInfo = this.$_cookie.get('userInfo')
      if (!userInfo) {
        var openid = this.$_cookie.get('smilife_openid') || this.$_cookie.get('newopenid')
        if (!openid) {
          let _code = this.getUrlParam('code')
          if (!_code) {
            this.goWxLogin()
          }
          else {
            this.getOpenIdByCode(_code)
          }
        }
        else {
          this.loginByOpenid(openid)
        }
      }
    },
    goWxLogin() { // 微信登陆,通过发送请求,获取一个跳去微信登陆的地址,之后又将带着code返回该页面
      let _locationNow = window.location.origin + window.location.pathname
      _locationNow = encodeURIComponent(_locationNow)
      this.$_api.post({
        ext: `${WX_LOGIN_BASEURL}`,
        redirectUri: _locationNow,
        state: 1,
        type: 1
      })
        .then(res => {
          if (res.code === 1) {
            window.location.href = res.entity.value
          }
        })
    },
    getOpenIdByCode(code) { // 通过上面的微信登陆返回的带code的地址,通过code请求openid
      this.$_api.post({
        ext: `${WX_OPENID_BY_CODE}`,
        // ext:'http://10049.smi170.com/communication/wx/getWXOpenid',
        code: code
      })
        .then(res => {
          if (res.code === 1) {
            var state = {
              title: "页面跳过替换",
              url: location.pathname + location.hash
            };
            history.replaceState(state, "", location.pathname + location.hash);

            this.$_cookie.set({
              'smilife_openid': res.entity.value
            }, null, '/');
            this.openid = res.entity.value;
            this.loginByOpenid(res.entity.value)
          }
        })
    },
    loginByOpenid(openid) { // 通过openid微信登陆, 最终都通过这里来获取用户信息
      if (!this.loginNeed) {
        return false;
      }
      this.$_api.post({
        ext: 'public/auto/login',
        openid: openid
      })
        .then(res => {
          if (res.code === 1) {
            // res.data.token = 'NjZlMTY0ZDMtMGE3Zi00OWQzLWE2OTYtNmMzYzcyNDQxN2M3'
            if (res.data) { // 如果返回用户信息数据
              this.userinfo = res.data
              cookie.set({
                userinfo: res.data
              })
              this.$_cookie.set({
                'newtoken': res.data.token,
              }, 24 * 60, '/')
            }
            else {  // 否则清空之前留下的用户信息
              // alert()
              this.$_cookie.set({
                userinfo: '{}'
              }, -24 * 60)
            }
          }
        })
    },

  }
}
</script>
<style lang="scss" scoped>
@import '../themes/_variable.scss';
@import '../themes/_basic.scss';
</style>
