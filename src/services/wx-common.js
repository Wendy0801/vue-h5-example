
import api from '@/services/api';
import cookie from '@/services/cookie';

import {
WX_BASE_URL
} from './config'

const wx_common = {

    getWXCode: function (thisURL,pdSn,orderId) {
        var requestUrl = encodeURIComponent(thisURL.split('?')[0]);
        api.post({
            'ext': `${WX_BASE_URL}wx/getWXCode`,
            'redirectUri': requestUrl,
            'state': pdSn,
            'type': 1
        }).then(res => {
            if (res.code == 1) {
                window.location.href = res.entity.value;
            } else {
                this.$_showtip(res.msg);
            }
        })
    },
    getWXOpenid: function (code,sec) {
        api.post({
            'ext': `${WX_BASE_URL}wx/getWXOpenid`,
            'code': code
        }).then(res => {
            if (res.code == 1) {
                cookie.set({ smilife_openid: res.entity.value}, 7* 24 * 60, "/");
                sec(res.entity.value)
            } else {
                this.$_showtip(res.msg);
            }
        })

    },
    getQueryStringRegExp: function (name) {
        var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)");
        var r = window.location.href.substr(1).match(reg);  //匹配目标参数
        if (r != null) return decodeURIComponent(r[2]);
        return null; //返回参数值
    }

}
export default wx_common
