<template>
    <div class="submit-page-page">
        <header class="smi-header">
            <go-back></go-back>
            <h2>提交订单</h2>
        </header>
        <main class="smi-content">
            <section class="margin-bottom">
                <div class="row-heigth bottom-border spacing">
                    <span class="cell">{{goodsName}}</span>
                    <span class="fr">￥{{standardPrice | price_format}}</span>
                </div>
                <div class="row-heigth bottom-border spacing">
                    <span>数量</span>
                    <div class="select fr">
                        <button type="button" class="reduce" @click="reduce"></button>
                        <input type="text" v-model="productNum" :value="productNum" readonly>
                        <button type="button" class="add" @click="add"></button>
                    </div>
                </div>
                <div class="row-heigth spacing">
                    <span>商品总价</span>
                    <span class="fr">￥{{priceSum | price_format}}</span>
                </div>
            </section>
            <section class="flow-h margin-bottom" v-if="isFlowBuy==1 && ismobile170">
                <div class="spacing">
                    <div class="flow-change fl">流量抵扣
                        <i class="iconfont icon-wenhao" @click="show=true"></i>
                        <div class="flow">(共
                            <span>{{remainNum}}</span>MB,可用
                            <span>{{availableFlow | flow_format}}</span>MB抵扣
                            <span>{{availableMoney}}</span>元)</div>
                    </div>
                    <span class="flow-switch">
                        <mt-switch class="switch-bg" v-model="flowSwitch" @change="isFlow"></mt-switch>
                    </span>
                </div>
            </section>
            <section class="mh">
                <div class="row-heigth bottom-border spacing">
                    <span>已绑定手机</span>
                    <span class="fr">{{mobileNumber}}</span>
                </div>
                <div class="row-heigth bottom-border spacing" @click="openPicker">
                    <span>预计消费时间(非必填)</span>
                    <span class="fr">{{pickerValue}}
                        <i class="iconfont icon-right fr"></i>
                    </span>
                </div>
            </section>
            <section class="submit-tab">
                <div class="fl">
                    <span class="sum-text">订单总额:</span>
                    <span class="sum-sum">￥{{paySum | price_format}}</span>
                </div>
                <button type="button" class="fr saleing" @click="submitOrder">提交订单</button>
            </section>
        </main>
        <template>
            <mt-datetime-picker ref="picker" type="date" v-model="pickerVisible" :startDate="startDate" @confirm="handleChange">
            </mt-datetime-picker>
        </template>
        <section class="show-rule" v-show="show">
            <div class="rule">
                <div class="rule-h">
                    <span>流量抵扣规则</span>
                </div>
                <div class="rule-content">
                    <p>1.{{flowCashRatio}}MB流量抵扣1元。</p>
                    <p>2.流量抵扣单位为MB,不足1MB按照1MB扣除。</p>
                </div>
                <div class="close-rule">
                    <button @click="show=false">我知道了</button>
                </div>
            </div>
    
        </section>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import GoBack from '@/components/GoBack';
import LoadMore from '@/components/LoadMore.vue';
import { Indicator, MessageBox } from 'mint-ui';

export default {
    name: 'submit-page',
    components: {
        'load-more': LoadMore,
        'go-back': GoBack
    },
    data() {
        return {
            custId: '',
            token: '',
            businessId: '',
            productId: '',
            startDate: new Date(),
            flowSwitch: false,
            pickerVisible: '',
            pickerValue: '',
            mobileNumber: '',
            goodsName: '',//商品名称
            isFlowBuy: 0,//是否支持流量兑换
            ismobile170: false,
            standardPrice: 0,//商品最终购买单价
            productNum: 1,//商品数量
            remainNum: 0,//总流量
            availableFlow: 0,//抵用流量
            flowCashRatio: 0,//兑换比率
            flowExchangeNum: 0,//兑换流量数量
            flowExchangeMoney: 0,//流量抵扣金额
            priceSum: 0,//订单的总额
            paySum: 0,//最终支付的金额
            availableMoney: 0,//抵用金额
            show: false

        }
    },
    computed: {
    },
    mounted() {
        var userInfo = JSON.parse(this.$_cookie.get('userInfo'));
        this.token = userInfo.token;
        this.businessId = this.$route.params['businessId'];
        this.productId = this.$route.params['productId'];
        this.getOrderInfo();

    },
    methods: {

        submitOrder() {

            this.$_api.auth()
                .then(userinfo => {
                    var token = userinfo.token, custId = userinfo.custId;
                    Indicator.open();
                    this.$_api.post({
                        'ext': 'order/order-submit',
                        'goodsId': this.productId,
                        'businessId': this.businessId,
                        'custId': custId,
                        'quantity': this.productNum,
                        'price_sum': this.priceSum,
                        'user_phone': this.mobileNumber,
                        'plan_use_date': this.pickerValue == '' ? null : this.pickerValue,
                        'flow_pay': this.flowSwitch ? (this.remainNum == 0 ? 0 : 1) : 0,
                        'flowExchangeNum': Math.ceil(this.flowExchangeNum),
                        'flowExchangeMoney': this.flowExchangeMoney,
                        'token': token
                    }, false, false).then(res => {
                        Indicator.close();
                        if (res.code == 1) {
                            // this.$_api.skipPage()
                            //     .then(() => {
                                    if (this.paySum == 0) {
                                        this.$router.replace({
                                            path: `/pay-center/${res.data.orderId}`,
                                        });
                                    } else {
                                        this.$router.replace({
                                            path: `/go-pay/${res.data.orderId}/${res.data.pdSn}/${this.paySum}`,
                                        });
                                    }
                                // })
                        }
                        else {
                            this.$_showtip(res.msg, 'error');
                        }
                    })
                })
                .catch(error => {
                    console.log(error);
                })
        },
        isFlow() {
            var flowPrice = this.remainNum / this.flowCashRatio;
            var pSum = this.standardPrice * this.productNum;
            if (this.flowSwitch) {

                if (flowPrice >= pSum) {
                    this.paySum = 0;
                    this.flowExchangeNum = pSum * this.flowCashRatio;
                    this.flowExchangeMoney = pSum;
                } else {
                    this.paySum = (pSum - flowPrice).toFixed(2);
                    this.flowExchangeNum = flowPrice * this.flowCashRatio;
                    this.flowExchangeMoney = flowPrice;
                }
            } else {
                this.paySum = pSum.toFixed(2);
                this.flowExchangeNum = 0;
                this.flowExchangeMoney = 0;

            }

            this.priceSum = pSum.toFixed(2);


        },
        getAvailableFlow() {
            var flowPrice = this.remainNum / this.flowCashRatio;
            var pSum = this.standardPrice * this.productNum;
            if (flowPrice >= pSum) {
                this.availableFlow = (pSum * this.flowCashRatio).toFixed(2);
                this.availableMoney = this.availableFlow / this.flowCashRatio;
            } else {
                this.availableFlow = this.remainNum;
                this.availableMoney = this.availableFlow / this.flowCashRatio;
            }
        },
        getFlowInfo() {
            this.$_api.post({
                'ext': 'order/getFlowInfo',
                'token': this.token
            }, true, false).then(res => {
                console.log(res);
                this.remainNum = res.data.remainNum;
                this.flowCashRatio = res.data.flowCashRatio;
                this.mobileNumber = res.data.mobile;
                this.ismobile170 = res.data.mobile.indexOf('170') > -1 ? true : res.data.mobile.indexOf('171') > -1 ? true : false;

                // this.availableFlow = this.standardPrice * this.productNum * res.data.flowCashRatio;
                this.getAvailableFlow();
                this.isFlow();
            }).finally(() => {

            })
        },
        getOrderInfo() {
            this.$_api.post({
                'ext': 'order/order-form',
                'product_id': this.productId,
                'token': this.token
            }, null, false).then(res => {
                if (res.code == 1) {
                    console.log(res);
                    var data = res.data;
                    this.goodsName = data.goodsName;
                    this.standardPrice = data.standardPrice;
                    this.isFlowBuy = data.isFlowBuy;
                    this.paySum = data.standardPrice * this.productNum;
                    this.priceSum = data.standardPrice * this.productNum;

                    //获取流量及兑换比率
                    this.getFlowInfo();
                } else {

                }

            }).finally(() => {

            })
        },
        add() {
            this.productNum = this.productNum + 1;
            this.getAvailableFlow();
            this.isFlow();
        },
        reduce() {
            if (this.productNum > 1) {
                this.productNum = this.productNum - 1;
            } else {
                this.productNum = 1;
                this.$_showtip('数量不能少于1件', 'warning');
            }
            this.getAvailableFlow();
            this.isFlow();

        },
        handleChange(value) {
            this.pickerValue = value.Format("yyyy-MM-dd");
        },
        openPicker() {
            this.$refs.picker.open();
        },


    }
}

</script>
<style lang="scss" src="./submit-order.scss" scoped></style>