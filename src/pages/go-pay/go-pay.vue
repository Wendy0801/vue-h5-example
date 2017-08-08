<template>
    <div class="edit-comment-page">
        <header class="smi-header">
            <go-back></go-back>
            <h2>支付跳转中,请稍候...</h2>
        </header>
        <main class="smi-content">

        </main>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import GoBack from '@/components/GoBack';
    import LoadMore from '@/components/LoadMore.vue';
    import WxCommon from '@/services/wx-common';
    import { Indicator } from 'mint-ui';

    export default {
        name: 'edit-comment',
        components: {
            'load-more': LoadMore,
            'go-back': GoBack
        },
        data() {
            return {
                pdSn: '',
                orderId: '',
            }
        },
        computed: {
        },
        mounted() {
            // setTimeout(()=> {
            //     this.$_api.replacePage('order-list')
            //                 .then(()=>{
            //                     // this.getUserOpenId();// 微信里
            //                 })
            // }, 3000);

            // return false
            // var isPageHide = false;
            // window.addEventListener('pageshow', function () {
            //     if (isPageHide) {
            //         window.location.reload();
            //     }
            // });
            // window.addEventListener('pagehide', function () {
            //     isPageHide = true;
            // });

            // Indicator.open();
            this.pdSn = this.$route.params['pdSn'];
            this.orderId = this.$route.params['orderId'];
            this.amount = this.$route.params['amount'];

            if (this.$_config.isWechat) {
                setTimeout(() => {
                    this.$_api.replacePage('order-list')
                        .then(() => {
                            this.getUserOpenId();// 微信里
                        })
                }, 1000);
            }
            else if (this.$_config.isSmiApp) {
                var orderId = this.orderId; //订单号
                var orderAmount = this.amount; //金额
                var orderType = 1;
                var closeViewType = 4; //??
                this.$_api.skipPage()
                    .then(() => {
                        window.location = `smilife://pay?orderId=${orderId}&orderAmount=${orderAmount}&orderType=${orderType}&closeViewType=${closeViewType}`
                    })
            }
            else {
                this.wapPayOrder();//非微信
            }
        },
        methods: {
            goSuccess() {
                var state = {
                    title: "页面跳过替换",
                    url: location.pathname + "#/history-back-skip"
                };
                history.replaceState(state, "", location.pathname + '#/order-list?v=20170728');
            },
            getUserOpenId() {
                var openid = this.$_cookie.get('smilife_openid') || '123';
                if (openid) {
                    this.wxPayOrder(openid);
                } else {
                    var thisUrl = window.location.href;
                    if (thisUrl.indexOf('code') > -1) {
                        var code = WxCommon.getQueryStringRegExp('code');
                        WxCommon.getWXOpenid(code, function (getOpenid) {
                            this.wxPayOrder(getOpenid);
                        });
                    } else {
                        WxCommon.getWXCode(thisUrl, this.pdSn, this.orderId);
                    }

                }
            },
            wxPayOrder(openid) {
                this.$_api.post({
                    'ext': 'deposit/pay/placeOrder',
                    'pd_sn': this.pdSn,
                    'channel': 'WX',
                    'openId': openid,
                    'url': window.location.origin + `/smilife-serve/#/pay-success/${this.orderId}`
                }, null, false).then(res => {
                    Indicator.close();
                    if (res.code == 1) {
                        // this.goSuccess();
                        // this.$router.replace({
                        //     path: `/order-list`
                        // })
                        // var state = {
                        //     title: "页面跳过替换",
                        //     url: location.pathname + "#/history-back-skip"
                        // };
                        // history.replaceState(state, "", location.pathname + '#/order-list?v=20170728');
                        // setTimeout(() => {
                        //     window.location.href = res.entity.url;
                        // }, 100)
                        window.location.href = res.entity.url;
                    } else {
                        this.$_showtip(res.msg, 'error');
                    }
                    Indicator.close();
                }).finally(res => {
                })
            },
            wapPayOrder() {
                this.$_api.post({
                    'ext': 'deposit/pay/placeOrder',
                    'pd_sn': this.pdSn,
                    'channel': 'WAP',
                    'url': window.location.origin + `/smilife-serve/#/pay-success/${this.orderId}`
                }, null, false).then(res => {
                    if (res.code == 1) {
                        // this.goSuccess();
                        // this.$router.replace({
                        //     path: `/order-list`
                        // })
                        // var state = {
                        //     title: "页面跳过替换",
                        //     url: location.pathname + "#/history-back-skip"
                        // };
                        // history.replaceState(state, "", location.pathname + '#/order-list?v=20170728');
                        // setTimeout(() => {
                        //     window.location.href = res.entity.url;
                        // }, 200)
                        this.$_api.replacePage('order-list')
                            .then(() => {
                                window.location.href = res.entity.url;
                            })
                    } else {
                        this.$_showtip(res.msg, 'error');
                    }
                    Indicator.close();
                }).finally(res => {

                })
            },
        }
    }

</script>
<style lang="scss" src="./go-pay.scss" scoped></style>