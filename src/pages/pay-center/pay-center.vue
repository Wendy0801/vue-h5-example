<template>
    <div class="pay-center-page">
        <header class="smi-header">
            <go-back></go-back>
            <h2>支付订单</h2>
        </header>
        <main class="smi-content">
            <div class="pay-countdown">
                <div v-if="payCountDownTime">
                    支付剩余时间：
                    <span>{{payCountDownTime}}</span>
                </div>
                <div v-if="payCountDownTime===0">
                    订单已过期
                </div>
            </div>
            <div class="pay-type-container">
                <ul class="pay-type-list">
                    <li class="pay-type-item pay-type-balance" :class="{'active':payTypeActive==='balance'}" @click="chooseType('balance')">
                        <div class="pay-type-name">
                            星美余额支付({{accoutBalance}}元)
                        </div>
                        <div class="type-select-icon">
                            <i class="iconfont icon-zhengque1"></i>
                        </div>
                    </li>
                    <li class="pay-type-item pay-type-wechat" :class="{'active':payTypeActive==='wechat'}" @click="chooseType('wechat')">
                        <div class="pay-type-name">
                            微信
                        </div>
                        <div class="type-select-icon">
                            <i class="iconfont icon-zhengque1"></i>
                        </div>
                    </li>
                    <li class="pay-type-item pay-type-ali" :class="{'active':payTypeActive==='ali'}" @click="chooseType('ali')">
                        <div class="pay-type-name">
                            支付宝
                        </div>
                        <div class="type-select-icon">
                            <i class="iconfont icon-zhengque1"></i>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="pay-count cl">
                <div class="fl">订单总额:</div>
                <div class="fr">¥0</div>
            </div>
            <div class="order-action-bar smi-action-bar actionbar-fixed-bottom" v-if="payCountDownTime">
                <button class="" @click="payNow()">确认支付</button>
            </div>
        </main>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import GoBack from '@/components/GoBack';
    import LoadMore from '@/components/LoadMore.vue';

    export default {
        name: 'pay-center',
        components: {
            'load-more': LoadMore,
            'go-back': GoBack
        },
        data() {
            return {
                payTypeActive: '',
                orderTime: new Date('2017-07-18 14:26:50.0'), // 下单时间
                countDownTimer: null,
                restPayTime: 0,
                payCountDownTime: null,
                accoutBalance: 0,
            }
        },
        computed: {
        ...mapGetters({
            })
        },
        mounted() {
            this.orderId = this.$route.params.orderId;
            this.getMyAccout();
            this.getOrderDetail();
        },
        methods: {
            getOrderDetail() {
                this.$_api.auth()
                    .then(userinfo => {
                        var token = userinfo.token;
                        this.$_api.post({
                            'ext': 'my-info/order-details',
                            'orderId': this.orderId,
                            // 'status': 0,
                            'token': token
                        })
                            .then(res => {
                                if (res.code == 1) {
                                    // this.orderInfo = res.data;
                                    // this.business_id = res.data.goods.businessId;
                                    // this.product_id = res.data.goods.goodsId;
                                    // this.orderStatus = res.data.orderStatus;
                                    this.orderTime = res.data.orderTime || new Date('2017-07-18 18:14:50.0');
                                    this.countDownPay();
                                }
                            })
                    })
            },
            getMyAccout() {
                // this.$_cookie.set({
                //     'token':''
                // })
                this.$_api.auth()
                    .then(userinfo => {
                        var token = userinfo.token;
                        this.$_api.get({
                            ext: 'user/get-account',
                            token: token
                        })
                            .then(res => {
                                if (res.code === 1) {
                                    this.accoutBalance = res.data.balance;
                                }
                            })
                    })
            },
            chooseType(type) {
                this.payTypeActive = type;
            },
            countDownPay() {
                var _allRestTime = 15 * 60 * 1000;
                this.restPayTimeSec = Math.floor((_allRestTime - (new Date().getTime() - new Date(this.orderTime).getTime())) / 1000);
                if (this.restPayTimeSec < 0) {
                    this.payCountDownTime = 0;
                    return false;
                }
                this.countDownTimer = setInterval(() => {
                    this.restPayTimeSec--;
                    if (this.restPayTimeSec < 0) {
                        this.payCountDownTime = 0;
                        clearInterval(this.countDownTimer);
                        location.reload();
                        // this.getOrderDetail();
                    }
                    else {
                        var _min = Math.floor(this.restPayTimeSec / 60);
                        var _sec = this.restPayTimeSec % (60);
                        this.payCountDownTime = _min + '分' + _sec + '秒';
                    }
                }, 1000)
            },
            payNow() {
                // this.paySuccess()
                // console.log(this.payTypeActive);
                // return;
                this.$_api.auth()
                    .then(userinfo => {
                        if (this.payTypeActive) {
                            var token = userinfo.token;
                            this.$_api.post({
                                ext: 'order/updateOrderByFlowInfo',
                                orderId: this.orderId,
                                token
                            }, true)
                                .then(res => {
                                    console.log(res)
                                    if (res.code === 1) {
                                        this.paySuccess(this.orderId);
                                    }
                                    else {
                                        this.$_showtip('支付失败!', 'error');
                                    }
                                })
                        } else {
                            this.$_showtip('请选择支付方式');
                        }

                    })
            },
            paySuccess(orderId) {
                var state = {
                    title: "页面跳过替换",
                    url: location.pathname + "#/history-back-skip"
                };
                history.replaceState(state, "", location.pathname + '#/history-back-skip?t=1');
                setTimeout(() => {
                    this.$router.push({
                        path: `/pay-success/${orderId}`
                    })
                }, 600)
            }
        }
    }

</script>
<style lang="scss" src="./pay-center.scss" scoped></style>