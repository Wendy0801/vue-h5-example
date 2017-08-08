import Vue from 'vue'
import axios from 'axios'
import {
  API_ROOT,
  CONTENT_TYPE,
  NORAML_LOGIN_BASEURL
} from './config'
const REQUEST = axios.create()
REQUEST.defaults.baseURL = API_ROOT
REQUEST.defaults.headers.post['Content-Type'] = CONTENT_TYPE
// REQUEST.defaults.transformResponse = function (data) {
//   console.log(data)
//   return {};
// }

// 数据加密
import Hashes from 'jshashes'
import cookie from './cookie'
import jsonp from 'jsonp'
import { Toast, MessageBox, Indicator } from 'mint-ui'

const api = {
  auth() {
    return new Promise((resolve, reject) => {
      var userInfo = cookie.get('userInfo');
      console.log(userInfo);
      if (userInfo) {
        userInfo = JSON.parse(userInfo);
        resolve(userInfo);
      } else {
        this.jumpLogin();
        //  reject('用户未登录');
      }
    })
  },
  jumpLogin: function () {
    console.log()
    MessageBox({
      // title: '登录提示',
      title: '',
      message: '请先登录!',
      confirmButtonText: '去登录',
      showCancelButton: true
    }).then(action => {
      if (action === 'confirm') {
        if (window.app_config.isSmiApp) {
          window.location = 'smilife://login'
        }
        else {
          window.location.href = `${NORAML_LOGIN_BASEURL}?returnUrl=` + encodeURIComponent(window.location.href);
        }
        return false;
      }
    });
  },
  get(data, showWait = false, needPosition = false, islogin = false) {
    return this.request('get', data, showWait, needPosition, islogin)
  },
  post(data, showWait = false, needPosition = false, islogin = false) {
    return this.request('post', data, showWait, needPosition, islogin)
  },
  request(method, data, showWait, needPosition, islogin) {
    let url = data.ext
    if (islogin) {
      if (!data.token) {
        if (cookie.get('userInfo')) {
          let token = JSON.parse(cookie.get('userInfo')).token
          // alert(token)
          data = Object.assign(data, {
            token
          })
        } else {
          this.jumpLogin();
          return;
        }
      }
    }
    delete data.ext
    let config = {
      url,
      method
    }
    if (needPosition && cookie.get('position_x')) {
      Object.assign(data, {
        longitude: cookie.get('position_x'),
        latitude: cookie.get('position_y'),
      })
    }
    method === 'get' ? Object.assign(config, {
      params: data
    }) : Object.assign(config, {
      data: this.dataStringify(data)
    })
    if (showWait) {
      this.handleWait()
    }
    return REQUEST(config)
      .then(result => this.handleSucc(result))
      .catch(error => this.handleError(error))
  },
  jsonp(url) {
    return new Promise((resolve, reject) => {
      jsonp(url, function (err, data) {
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      })
    })
  },
  dataStringify(data) {
    var _dataArr = []
    for (var attr in data) {
      _dataArr.push(`${attr}=${data[attr]}`)
    }
    return _dataArr.join('&')
  },
  handleWait() {
    Indicator.open()
    // console.log('请求中..')
  },
  handleSucc(result) {
    // console.log(result)
    // console.log('请求结束..')
    Indicator.close()
    return result.data
  },
  handleError(error) {
    // console.log('请求错误..')
    Vue.prototype.$_showtip('请求错误,请稍后重试', 'error')
    throw {
      msg: '请求错误',
      type: 'user'
    }
  },
  replacePage(replaceHash) {  // 替换当前页面
    return new Promise((resolve, reject) => {
      var randomKey = new Date().getTime() + '_' + parseInt(Math.random() * 1000000);
      var _hashIndex = location.href.indexOf('#')
      var _unHashUrl
      if (_hashIndex !== -1) {
        _unHashUrl = location.href.substring(0, _hashIndex)
      }
      else {
        _unHashUrl = location.href
      }
      var replaceUrl = _unHashUrl + `#/${replaceHash}?t=` + randomKey
      // alert(replaceUrl)
      var state = {
        title: "页面跳过替换" + randomKey,
        url: replaceUrl
      };
      history.replaceState(state, "", replaceUrl);
      setTimeout(() => {
        resolve(true);
      }, 400)
    });
  },
  skipPage() {  // 略过页面
    return this.replacePage('history-back-skip')
  },
  md5(str) {
    var md5Helper = new Hashes.MD5
    var str = md5Helper.hex(str)
    md5Helper = null
    return str
  },
  sha1(str) {
    var sha1Helper = new Hashes.SHA1
    var str = sha1Helper.hex(str)
    sha1Helper = null
    return str
  },
  getLoginSign(salt = '1491967716993', action) {
    var companyKey = cookie.get('companykey') || '0123456789ABCDEF'
    var sha1pwd = cookie.get('sha1pwd')
    var usr = cookie.get('usr')
    var str = this.sha1(salt + sha1pwd + `&action=${action}&usr=${usr}&company-key=${companyKey}`);
    return str
  },
  getSign(salt, data) {
    var allParams = this.dataStringify(data)
    var secret = cookie.get('secret')
    var token = cookie.get('token')
    return this.sha1(salt + secret + token + allParams)
  }
}

export default api