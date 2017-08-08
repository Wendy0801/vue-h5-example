<template>
    <div class="order-list-page">
        <header class="smi-header">
            <go-back :url="'exitApp'" v-if="backIsExitApp"></go-back>
            <go-back :url="'justgoback'" v-if="!backIsExitApp"></go-back>
            <h2>订单列表</h2>
        </header>
        <main class="smi-content">
            <section class="order-nav">
                <ul>
                    <li :class="{'active':tabType==='total'}" @click="changeOrderType('total',0)">
                        <div>全部</div>
                    </li>
                    <li :class="{'active':tabType==='pay'}" @click="changeOrderType('pay',1)">
                        <div>待付款</div>
                    </li>
                    <li :class="{'active':tabType==='user'}" @click="changeOrderType('user',2)">
                        <div>待使用</div>
                    </li>
                    <li :class="{'active':tabType==='comment'}" @click="changeOrderType('comment',3)">
                        <div>待评论</div>
                    </li>
                </ul>
            </section>
            <section class="order-contain">
                <div v-infinite-scroll="loadMoreOrder" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
                    <ul class="order-list">
                        <li class="margin-bottom" v-for="(item,index) in orderList" :key="index">
                            <div class="sh bottom-border spacing">
                                <span>{{item.orderTime | dateFilter}}</span>
                                <span class="fr order-status" v-if="item.orderStatus==1">待付款</span>
                                <span class="fr order-status" v-if="item.orderStatus==2">待使用</span>
                                <span class="fr order-status" v-if="item.orderStatus==3">待评价</span>
                                <span class="fr order-status" v-if="item.orderStatus==4">已完成</span>
                                <span class="fr order-status" v-if="item.orderStatus==5">已取消</span>
                                <span class="fr order-status" v-if="item.orderStatus==6">已过期</span>
                            </div>
                            <router-link :to="{name:'order-detail',params:{orderId:item.orderId}}">
                                <div class="spacing order-info">
                                    <div class="fl order-icon"><img :src="item.goodsLogo" /></div>
                                    <div class="order-name">
                                        <h2>{{item.orderTitle}}</h2>
                                        <p class="order-text">数量：<span>{{item.goodsNum}}</span></p>
                                        <p class="order-text">订单总额：<span></span>￥{{item.settlePrice}}</p>
                                        <i class="iconfont icon-right"></i>
                                    </div>
                                </div>
                            </router-link>
                            <div class="sh top-border spacing order-opera">
                                <button class="fr " v-if="item.orderStatus==1 && item.settlePrice == 0" @click="buy(item.settlePrice,item.orderId)">去支付</button>
                                <button class="fr " v-if="item.orderStatus==1 && item.settlePrice > 0 " @click="buy(item.settlePrice,item.orderId,item.outTradeNo)">去支付</button>
                                <button class="fr " v-if="item.orderStatus==2" @click="showCode(item.ticketCode,item.enableEndTime)">查看券码</button>
                                <router-link v-if="item.orderStatus==3" :to="{name:'submit-comment',params:{orderId:item.orderId,status:item.orderStatus}}">
                                    <button class="fr ">去评论</button>
                                </router-link>
                                <router-link v-if="item.orderStatus==4" :to="{'name':'serve-detail',params:{businessId:item.orderGoodsList[0].businessId,productId:item.orderGoodsList[0].goodsId}}">
                                    <button class="fr ">再来一单</button>
                                </router-link>
                                <router-link v-if="item.orderStatus==5" :to="{'name':'serve-detail',params:{businessId:item.orderGoodsList[0].businessId,productId:item.orderGoodsList[0].goodsId}}">
                                    <button class="fr ">重新购买</button>
                                </router-link>
                                <router-link v-if="item.orderStatus==6" :to="{'name':'serve-detail',params:{businessId:item.orderGoodsList[0].businessId,productId:item.orderGoodsList[0].goodsId}}">
                                    <button class="fr ">重新购买</button>
                                </router-link>
                            </div>
                        </li>
                    </ul>
                </div>

            </section>
            <section class="show-code" v-show="show" @click="show=false">
                <div class="code">
                    <!--<span class="close-code"><i class="iconfont icon-cuo fr"></i></span>-->
                    <div class="code-h">
                        <span>星美券</span>
                        <span class="fr">有效期至{{enableEndTime | dateFilter}}</span>
                    </div>
                    <div class="code-qcode">
                        <qrcode :value="codeNumber" :options="{ size: 150 }"></qrcode>
                        <p>消费时请向商家出示以上券码</p>
                    </div>
                </div>

            </section>
            <load-more :loading="loading" :allLoaded="allLoaded"></load-more>
        </main>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import GoBack from '@/components/GoBack';
    import LoadMore from '@/components/LoadMore.vue';
    import VueQrcode from 'vue-qrcode';
    export default {
        name: 'order-list',
        components: {
            'load-more': LoadMore,
            'go-back': GoBack,
            'qrcode': VueQrcode,
        },
        data() {
            return {
                orderId: '',
                loading: true,
                allLoaded: false,
                tabType: 'total',
                status: 0,
                pageNum: 1,
                pageSize: 30,
                orderList: [],
                show: false,
                orderTime: '',
                codeNumber: '',
                enableEndTime: '',
                backIsExitApp: false
            }
        },
        computed: {
        },
        mounted() {
            this.backIsExitApp = this.$route.params.backApp ? true : false
            // var isPageHide = false;
            // window.addEventListener('pageshow', function () {
            //     if (isPageHide) {
            //         window.location.reload();
            //     }
            // });
            // window.addEventListener('pagehide', function () {
            //     isPageHide = true;
            // });

            if (this.backIsExitApp) {
                this.initAppUserinfo()
                this.getOrderList();
            }
            else {
                this.getOrderList();
            }
        },
        methods: {
            initAppUserinfo() {
                window.initUser = (data) => {
                    var _userinfo = JSON.parse(data)
                    if (_userinfo.token !== '') {
                        this.$_cookie.set({
                            'userInfo': data
                        })
                    }
                    else {
                        this.$_cookie.set({
                            'userInfo': data
                        }, -24 * 60)
                    }
                    this.getOrderList();
                }
                window.location = 'smilife://userInfo?callback=initUser'
            },
            getOrderList() {
                this.$_api.post({
                    'ext': 'my-info/order-page',
                    'status': this.status,
                    'pageNum': this.pageNum,
                    'pageSize': this.pageSize,
                    'token': this.token
                }, null, false, true).then(res => {
                    if (res.code == 1) {
                        this.orderList = [];
                        console.log(res);
                        this.orderList = this.orderList.concat(res.data.list);
                        this.loading = false;
                        if (res.data.list.length < this.pageSize) {
                            this.allLoaded = true;
                        }

                    }

                }).finally(() => {

                })
            },
            showCode(code, time) {
                this.show = true;
                this.codeNumber = code;
                this.enableEndTime = time;
            },
            buy(price, orderId, pdSnId) {
                if (price == 0) {
                    this.$router.push({
                        path: `/pay-center/${orderId}`,
                    });
                } else {
                    this.$router.push({
                        path: `/go-pay/${orderId}/${pdSnId}/${price}`,
                    });
                }
            },
            changeOrderType(type, value) {
                this.orderList = [];
                this.loading = true;
                this.allLoaded = false;
                this.tabType = type;
                this.status = value;
                this.getOrderList();
            },
            loadMoreOrder() {
                if (this.allLoaded) {
                    return false;
                }
                this.pageNum = Math.ceil(this.orderList.length / this.pageSize) + 1;
                this.getOrderList();
            }
        }
    }

</script>
<style lang="scss" src="./order-list.scss" scoped></style>