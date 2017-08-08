<template>
    <div class="order-detail-page">
        <header class="smi-header">
            <go-back></go-back>
            <h2>订单详情</h2>
        </header>
        <main class="smi-content" v-if="orderInfo&&orderInfo.goods">
            <div class="order-main" :class="{'has-padding-bottom':orderStatus!==2}">
                <!-- 待支付时间提示  -->
                <div class="pay-tip" v-if="payCountDownTime&&orderStatus===1">
                    支付剩余时间:{{payCountDownTime}}
                </div>
                <!-- 商品基本信息  -->
                <div class="order-shop-info detial-block">
                    <router-link :to="{'name':'serve-detail','params':{'businessId':orderInfo.goods.businessId,'productId':orderInfo.goods.goodsId}}">
                        <div class="block-content">
                            <div class="info-wrap cl">
                                <div class="shop-logo fl">
                                    <img :src="orderInfo.goodsLogo" alt="">
                                </div>
                                <div class="shop-info">
                                    <h4 class="shop-title">
                                        {{orderInfo.goods.goodsName}}
                                    </h4>
                                    <div class="shop-price">
                                        <span>￥{{orderInfo.goods.standardPrice}}</span>
                                        <del>￥{{orderInfo.goods.purchasePrice}}</del>
                                    </div>
                                </div>
                                <div class="arrow-link">
                                    <i class="iconfont icon-right"></i>
                                </div>
                            </div>
                        </div>
                    </router-link>
                    <div class="shop-tags block-footer">
                        <ul class="tags-list cl">
                            <li class="tag-item">
                                <i class="iconfont icon-zhengque"></i>
                                <span>不支持退款</span>
                                <!-- <span>{{orderInfo.goods.isRefund==1?'':'不'}}支持退款</span> -->
                            </li>
                            <li class="tag-item" v-if="orderInfo.goods.isExpect==1">
                                <i class="iconfont icon-zhengque"></i>
                                <span>{{orderInfo.goods.isExpect==1?'':'无'}}需预约</span>
                            </li>
                            <li class="tag-item" v-if="orderInfo.goods.isFlowBuy===1">
                                <i class="iconfont icon-zhengque"></i>
                                <span>流量抵扣</span>
                            </li>
                            <li class="tag-item">
                                <i class="iconfont icon-zhengque dark"></i>
                                <span>已售{{orderInfo.goods.soldNumber}}</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 已评价  -->
                <div class="order-feedback detial-block detail-single-row cl" v-if="orderStatus==3">
                    <router-link class="cl" :to="{'name':'submit-comment',params:{'orderId':orderId,'status':orderStatus}}">
                        <div class="order-start fl">
                            <star-rating :ratingNum="orderInfo.goods.goodsGrade"></star-rating>
                        </div>
                        <div class="order-feedback-right fr">
                            {{orderInfo.goods.goodsGrade}}分
                            <i class="iconfont icon-right"></i>
                        </div>
                    </router-link>
                </div>
                <!-- 星美券(待使用)  -->
                <div class="order-voucher detial-block" v-if="orderInfo.ticketCode&&orderInfo.isCheckSold===0">
                    <div class="block-header cl">
                        <h5 class="fl">星美券</h5>
                        <span class="fr block-header-right">有效期至{{orderInfo.goods.enableEndTime|substr_format(10)}}</span>
                    </div>
                    <div class="block-content">
                        <qrcode :value="orderInfo.ticketCode" :options="{ size: 100 }"></qrcode>
                        <p>{{orderInfo.ticketCode}}</p>
                    </div>
                    <div class="block-footer cl">
                        <a :href="ticketUrl">
                            <span class="fl">备注：电影券已打入您的个人帐号</span>
                            <span class="fr">
                                <i class="iconfont icon-right"></i>
                            </span>
                        </a>
                    </div>
                </div>
                <!-- 星美券(已使用)  -->
                <div class="order-voncher-ed cl detial-block detail-single-row" v-if="orderInfo.isCheckSold===1">
                    <div class="fl">星美券(已使用)</div>
                    <div class="fr">{{orderInfo.ticketCode||'1313123'}}</div>
                </div>
                <!--  适用门店 -->
                <div class="order-store detial-block" v-if="orderInfo.isCheckSold===0&&orderInfo.payStatus===1">
                    <div class="block-header">
                        <router-link :to="{'name':'store-list','params':{'businessId':business_id,'productId':product_id}}">
                            <div class="cl">
                                <h5 class="fl">适用门店({{latelyShop.total}})</h5>
                                <span class="fr block-header-right">
                                    <i class="iconfont icon-right"></i>
                                </span>
                            </div>
                        </router-link>
                    </div>
                    <div class="block-content">
                        <store-item :storeInfo="latelyShop" :longHide="true" :businessId="business_id" :productId="product_id"></store-item>
                    </div>
                </div>
                <!-- 套餐内容  -->
                <div class="order-package detial-block">
                    <div class="block-header">套餐内容</div>
                    <div class="block-content">

                        <div class="block-row cl" v-for="(item,index) in orderInfo.orderGoodsList" :key="index">
                            <div class="row-title fl">
                                {{item.goodsName}}
                            </div>
                            <div class="row-unit fl">
                                {{item.goodsNumber}}{{item.unitName||'个'}}
                            </div>
                            <div class="row-price fl">
                                {{orderInfo.goods.purchasePrice}}元
                            </div>
                        </div>

                        <div class="block-row cl" v-for="(item,index) in orderInfo.goodsGiftList" :key="index">
                            <div class="row-title fl">
                                {{item.goodsName}}
                            </div>
                            <div class="row-unit fl">
                                {{item.goodsNumber}}{{item.unitName||'个'}}
                            </div>
                            <div class="row-price fl">
                                {{item.standardPrice}}元
                            </div>
                        </div>

                        <div class="block-row cl">
                            <div class="row-title fl">
                            </div>
                            <div class="row-unit row-unit-dark fl">
                                原价
                            </div>
                            <div class="row-price fl">
                                {{allPrcie}}元
                            </div>
                        </div>
                        <div class="block-row cl">
                            <div class="row-title fl">
                            </div>
                            <div class="row-unit row-unit-dark fl">
                                特惠价
                            </div>
                            <div class="row-price fl">
                                {{orderInfo.goods.standardPrice}}元
                            </div>
                        </div>
                    </div>
                    <div class="block-footer">
                        <router-link :to="{'name':'graphic-details',params:{'businessId':orderInfo.goods.businessId,'productId':product_id}}">
                            <div class="cl">
                                <span class="fl">查看图文详情</span>
                                <span class="fr">
                                    <i class="iconfont icon-right"></i>
                                </span>
                            </div>
                        </router-link>
                    </div>
                </div>
                <!-- 消费须知  -->
                <div class="consumer-information detial-block" v-if="orderStatus==2&&productInfo.buyNotes">
                    <div class="block-header cl">
                        <h5 class="fl">消费须知</h5>
                    </div>
                    <div class="block-content">
                        <div class="consumer-row cl">
                            <h5 class="fl">有效时间:</h5>
                            <span class="fl">{{productInfo.buyNotes.enablEndTime}}</span>
                        </div>
                        <div class="consumer-row cl">
                            <h5 class="fl">使用时间:</h5>
                            <span class="fl">{{productInfo.buyNotes.useTime}}</span>
                        </div>
                        <div class="consumer-row cl">
                            <h5 class="fl">预约提示:</h5>
                            <span class="fl">{{productInfo.buyNotes.subscribePrompt}}</span>
                        </div>
                        <div class="consumer-row cl">
                            <h5 class="fl">使用人数:</h5>
                            <span class="fl">{{productInfo.buyNotes.useNumber}}</span>
                        </div>
                        <div class="consumer-row cl">
                            <h5 class="fl">温馨提示:</h5>
                            <span class="fl">{{productInfo.buyNotes.kindlyReminder}}</span>
                        </div>
                        <div class="consumer-row cl">
                            <h5 class="fl">影票说明:</h5>
                            <span class="fl">{{productInfo.buyNotes.giftDesc}}</span>
                        </div>
                    </div>
                </div>
                <!-- 订单信息  -->
                <div class="order-info-detail detial-block">
                    <div class="block-header cl">
                        <h5 class="fl">订单信息</h5>
                    </div>
                    <div class="block-content">
                        <div class="order-info-row cl">
                            <div class="order-info-label fl">
                                订单编号:
                            </div>
                            <div class="order-info-desc fr">
                                {{orderInfo.orderNo}}
                            </div>
                        </div>
                        <div class="order-info-row cl">
                            <div class="order-info-label fl">
                                手机号:
                            </div>
                            <div class="order-info-desc fr">
                                {{orderInfo.orderMobile}}
                            </div>
                        </div>
                        <div class="order-info-row cl">
                            <div class="order-info-label fl">
                                数量:
                            </div>
                            <div class="order-info-desc fr">
                                {{orderInfo.goodsNum}}
                            </div>
                        </div>
                        <div class="order-info-row cl">
                            <div class="order-info-label fl">
                                商品总价:
                            </div>
                            <div class="order-info-desc fr">
                                {{orderInfo.goods.standardPrice*orderInfo.goodsNum}}元
                            </div>
                        </div>
                        <div class="order-info-row cl">
                            <div class="order-info-label fl">
                                流量抵扣:
                            </div>
                            <div class="order-info-desc fr">
                                {{orderInfo.flowExchangeMoney}}元
                            </div>
                        </div>
                        <div class="order-info-row cl">
                            <div class="order-info-label fl">
                                订单总额:
                            </div>
                            <div class="order-info-desc fr">
                                {{orderInfo.goods.standardPrice*orderInfo.goodsNum-orderInfo.flowExchangeMoney}}元
                            </div>
                        </div>
                        <div class="order-info-row cl">
                            <div class="order-info-label fl">
                                下单时间:
                            </div>
                            <div class="order-info-desc fr">
                                {{orderInfo.orderTime|substr_format(16)}}
                            </div>
                        </div>
                        <div class="order-info-row cl" v-if="orderInfo.orderPayTime">
                            <div class="order-info-label fl">
                                支付时间:
                            </div>
                            <div class="order-info-desc fr">
                                {{orderInfo.orderPayTime|substr_format(16)}}
                            </div>
                        </div>
                        <div class="order-info-row cl" v-if="orderInfo.useTime">
                            <div class="order-info-label fl">
                                使用时间:
                            </div>
                            <div class="order-info-desc fr">
                                {{orderInfo.useTime|substr_format(16)}}
                            </div>
                        </div>
                        <div class="order-info-row cl" v-if="orderInfo.orderFinishTime">
                            <div class="order-info-label fl">
                                评价时间:
                            </div>
                            <div class="order-info-desc fr">
                                {{orderInfo.orderFinishTime|substr_format(16)}}
                            </div>
                        </div>
                        <div class="order-info-row cl" v-if="orderInfo.cancelTime">
                            <div class="order-info-label fl">
                                取消时间:
                            </div>
                            <div class="order-info-desc fr">
                                {{orderInfo.cancelTime|substr_format(16)}}
                            </div>
                        </div>
                        <div class="order-info-row cl" v-if="orderInfo.expectUseTime">
                            <div class="order-info-label fl">
                                预计消费时间:
                            </div>
                            <div class="order-info-desc fr">
                                {{orderInfo.expectUseTime|substr_format(16)|dateFilter}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--  待付款 -->
            <div v-if="orderStatus==1" class="order-action-bar smi-action-bar actionbar-fixed-bottom actionbar-col2">
                <button class="dark-btn" @click="cancelConfirm()">取消订单</button>
                <button type="button" @click="goPay()">去支付</button>
            </div>
            <!--  待使用 -->
            <!-- <div v-if="orderStatus==1" class="order-action-bar smi-action-bar actionbar-fixed-bottom">
                                        <button>去评价</button>
                                        <button>去评价</button>
                                    </div> -->
            <!--  待评价 -->
            <div class="order-action-bar smi-action-bar actionbar-fixed-bottom" v-if="orderStatus==3">
                <router-link :to="{name:'submit-comment',params:{'orderId':orderId,'status':orderStatus}}">去评价</router-link>
            </div>
            <!--  评价已完成 -->
            <div v-if="orderStatus==4" class="order-action-bar smi-action-bar actionbar-fixed-bottom">
                <button @click="buyAgain()">再来一单</button>
            </div>
            <!--  已取消 -->
            <div v-if="orderStatus==5" class="order-action-bar smi-action-bar actionbar-fixed-bottom">
                <button @click="buyAgain()">再次购买</button>
            </div>
            <!--  已过期 -->
            <div v-if="orderStatus==6" class="order-action-bar smi-action-bar actionbar-fixed-bottom">
                <button @click="buyAgain()">重新购买</button>
            </div>
        </main>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import GoBack from '@/components/GoBack';
    import StoreItem from '@/components/StoreItem';
    import Star from '@/components/Star';
    import StarRating from '@/components/StarRating';
    import LoadMore from '@/components/LoadMore.vue';
    import VueQrcode from 'vue-qrcode';
    import { Toast, MessageBox, Indicator } from 'mint-ui'

    import {
        TICKET_BASE_URL
    } from '@/services/config'

    export default {
        name: 'order-detail',
        components: {
            'load-more': LoadMore,
            'go-back': GoBack,
            'store-item': StoreItem,
            'star': Star,
            'star-rating': StarRating,
            'qrcode': VueQrcode,
            // 'vue-qrcode':VueQrcode
        },
        data() {
            return {
                orderInfo: {},
                business_id: '',
                product_id: '',
                latelyShop: {},
                orderStatus: 0,
                orderTime: new Date('2017-07-18 14:26:50.0'),
                countDownTimer: null,
                restPayTime: 0,
                payCountDownTime: null,
                productInfo: {},
                token: '',
                ticketUrl: ''
            }
        },
        computed: {
        ...mapGetters({
            }),
            allPrcie: function () {
                var goodPrice = 0;
                var giftPrice = 0;
                this.orderInfo.goodsGiftList.map(item => {
                    giftPrice += item.goodsNumber * item.standardPrice
                })
                this.orderInfo.orderGoodsList.map(item => {
                    goodPrice += item.goodsNumber * this.orderInfo.goods.purchasePrice
                })
                return goodPrice + giftPrice;
            }
        },
        mounted() {
            var userInfo = this.$_cookie.get('userInfo')
            this.ticketUrl = `${TICKET_BASE_URL}?token=` + JSON.parse(userInfo).token
            this.orderId = this.$route.params.orderId;
            this.getOrderDetail();
        },
        methods: {
            cancelConfirm() {
                MessageBox({
                    title: '',
                    message: '确定取消订单吗?',
                    confirmButtonText: '确认',
                    showCancelButton: true
                }).then(action => {
                    if (action === 'confirm') {
                        this.cancelOrder()
                    }
                });
            },
            cancelOrder() {
                this.$_api.auth()
                    .then(userinfo => {
                        var token = userinfo.token;
                        this.$_api.post({
                            'ext': 'order/order-cancel',
                            'orderId': this.orderId,
                            'token': token
                        }, true)
                            .then(res => {
                                if (res.code === 1) {
                                    this.$_showtip('取消订单成功');
                                    this.getOrderDetail();
                                }
                                else {
                                    this.$_showtip('取消订单失败,请稍后重试', 'error');
                                }
                            })
                    })
            },
            getOrderDetail() {
                this.$_api.auth()
                    .then(userinfo => {
                        var token = userinfo.token;
                        this.$_api.post({
                            ext: 'my-info/order-details',
                            orderId: this.orderId,
                            'token': token
                        })
                            .then(res => {
                                if (res.code == 1) {
                                    this.orderInfo = res.data;
                                    this.business_id = res.data.goods.businessId;
                                    this.product_id = res.data.goods.goodsId;
                                    this.orderStatus = res.data.orderStatus;
                                    this.orderTime = res.data.orderTime || new Date('2017-07-18 15:22:50.0');
                                    // this.orderStatus = 6;
                                    this.countDownPay();
                                    this.getLatelyShop();
                                    if (this.orderStatus === 2) {
                                        this.getProductInfo();
                                    }
                                }
                            })
                    })
            },
            getProductInfo() {
                // 
                this.$_api.post({
                    'ext': 'product/product-info',
                    'product_id': this.product_id
                })
                    .then(res => {
                        if (res.code === 1) {
                            this.productInfo = res.data;
                        }
                    })
            },
            getLatelyShop() {
                this.$_api.post({
                    ext: 'product/shop-lately',
                    business_id: this.business_id,
                    product_id: this.product_id
                }, null, true)
                    .then(res => {
                        if (res.code === 1) {
                            this.latelyShop = res.data;
                            this.latelyShop = Object.assign(this.latelyShop, {
                                businessId: this.business_id,
                                productId: this.product_id
                            })
                            console.log(this.latelyShop)
                        }
                    })
            },
            countDownPay() {
                if (this.orderStatus !== 1) {
                    return false;
                }
                var _allRestTime = 15 * 60 * 1000;
                this.restPayTimeSec = Math.floor((_allRestTime - (new Date().getTime() - new Date(this.orderTime).getTime())) / 1000);
                if (this.restPayTimeSec < 0) {
                    return false;
                }
                this.countDownTimer = setInterval(() => {
                    this.restPayTimeSec--;
                    if (this.restPayTimeSec < 0) {
                        this.payCountDownTime = null;
                        clearInterval(this.countDownTimer);
                        this.hasFinishCountDown = true;
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
            goPay() {
                if (this.orderInfo.settlePrice === this.orderInfo.flowExchangeMoney) {
                    this.$router.push({
                        'name': 'pay-center',
                        params: {
                            orderId: this.orderId
                        }
                    })
                }
                else {
                    var amount = this.orderInfo.goods.standardPrice * this.orderInfo.goodsNum - this.orderInfo.flowExchangeMoney
                    this.$router.push({
                        // ${res.data.orderId}/${res.data.pdSn}
                        path: `/go-pay/${this.orderId}/${this.orderInfo.outTradeNo}/${amount}`,
                    });
                }
            },
            buyAgain() {
                this.$router.push({
                    path: `/serve-detail/${this.business_id}/${this.product_id}`,
                });
            }
        },
    }

</script>
<style lang="scss" src="./order-detail.scss" scoped></style>