let reqUrl = ''
let wxBaseUrl = ''
let wxLoginBaseUrl = '' // 微信获取自动登陆地址
let wxOpenidByCode = '' // 通过跳转 wxLoginBaseUrl 地址处理后返回地址中有code .利用code取得openid
let normalLoginBaseUrl = '' // 通用的账号密码登陆地址
let ticketBaseUrl = '' // 电影票优惠券

let qiniuBaseUrl = ''
var env = process.env.NODE_ENV


const VERSION = 'V1'
if (env === 'development') { // 本地调试接口
  reqUrl = `http://192.168.68.23:33001/api-client/${VERSION}/`
  // reqUrl = `http://testmall.xingmeihui.com/api-client/${VERSION}/`
  //  reqUrl = `http://testsmi.assets.smi170.com/api-client/${VERSION}/`

  wxLoginBaseUrl = 'http://testsmi.assets.smi170.com/communication/wx/getWXCodeURLEncoder'
  wxOpenidByCode = 'http://testsmi.assets.smi170.com/communication/wx/getWXOpenid'

  normalLoginBaseUrl = `http://login.xingmeihui.com/login.html`
  wxBaseUrl = `http://testmall.xingmeihui.com/smiweb/api/`
  qiniuBaseUrl = `http://192.168.68.25:30001/api/V1/common/resource/qiniu/config`

  ticketBaseUrl = 'http://m.lol.ipiao.com/voucher_list.html'
  // ?source=smilife&token=ODNiNWQ2OGItNmIyZS00MzA5LWIyOGMtNTdmOGJiN2E5Mzdk
}
else if (env === 'production') {  // 线上接口
  reqUrl = `http://testmall.xingmeihui.com/api-client/${VERSION}/`

  // wxLoginBaseUrl = 'http://testmall.xingmeihui.com/smiweb/api/wx/getWXCode'
  // wxOpenidByCode = 'http://testmall.xingmeihui.com/smiweb/api/wx/getWXOpenid'

  wxLoginBaseUrl = 'http://testsmi.assets.smi170.com/communication/wx/getWXCodeURLEncoder'
  wxOpenidByCode = 'http://testsmi.assets.smi170.com/communication/wx/getWXOpenid'

  normalLoginBaseUrl = `http://login.xingmeihui.com/login.html`
  wxBaseUrl = `http://testmall.xingmeihui.com/smiweb/api/`
  qiniuBaseUrl = `http://192.168.68.25:30001/api/V1/common/resource/qiniu/config`

  ticketBaseUrl = 'http://m.ixingmei.com/voucher_list.html'
}

export const API_ROOT = reqUrl
export const CONTENT_TYPE = 'application/x-www-form-urlencoded'
// 跳转到微信自动登陆地址
export const WX_LOGIN_BASEURL = wxLoginBaseUrl
// 根据code获取openid
export const WX_OPENID_BY_CODE = wxOpenidByCode
// 正常登陆地址
export const NORAML_LOGIN_BASEURL = normalLoginBaseUrl
//微信获取信息地址
export const WX_BASE_URL = wxBaseUrl 
//七牛地址
export const QINIU_BASE_URL = qiniuBaseUrl
// 票务优惠券页面
export const TICKET_BASE_URL = ticketBaseUrl
