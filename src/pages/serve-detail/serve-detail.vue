<template>
    <div class="detail-page">
        <header class="smi-header">
            <go-back></go-back>
            <h2>服务详情</h2>
            <social-share :config="shareConfig"></social-share>
        </header>
        <main class="smi-content">
            
            <!--轮播图-->
            <section class="banner">
                <mt-swipe :auto="4000" style="height:50vw">
                    <mt-swipe-item v-for="(item,index) in banner" :key="index">
                        <img :src="item.url" alt="">
                    </mt-swipe-item>
                </mt-swipe>
            </section>
    
            <section class="servr-info">
                <h1>{{title}}</h1>
                <div>
                    <span class="special-offer">￥
                        <span class="special-price">{{price|price_format}}</span>
                    </span>
                    <span class="special-text">特惠价</span>
                    <span class="original-text">原价:
                        <span class="original-price">￥{{originalPrice|price_format}}</span>
                    </span>
                </div>
            </section>
    
            <section class="server-limit spacing">
                <ul class="limit-tip">
                    <li v-for="item in limits">
                        <i class="iconfont icon-zhengque limit-icon"></i>{{item.name}}
                    </li>
                    <li>
                        <i class="iconfont icon-zhengque"></i>已售{{soldOut}}
                    </li>
                </ul>
            </section>
    
            <section class="comment-summary">
                <div v-if="comment.commentSum>0">
                    <router-link :to="{'name':'comment-list',params:{productId:productId}}">
                        <div class="summary-head hb">
                            <span>评论({{comment.commentSum}})</span>
                            <div class="fr">
                                <star-rating :ratingNum="star"></star-rating>
                                <span class="star-score">{{star}}分</span>
                                <!--<img src="../../assets/icons/control_icon_back.png">-->
                                <i class="iconfont icon-right fr"></i>
                            </div>
                        </div>
                    </router-link>
                    <div class="summary-label bc">
                        <ul>
                            <li v-for="item in comment.labels">{{item.name}}{{item.quantity}}</li>
                        </ul>
                    </div>
                </div>
                <div v-else>
                    <router-link :to="{'name':'comment-list',params:{productId:productId}}">
                        <div class="summary-head hb">
                            <span>暂无评论</span>
                            <div class="fr">
                                <i class="iconfont icon-right fr"></i>
                            </div>
                        </div>
                    </router-link>
                </div>
    
            </section>
    
            <section class="applicable-store">
    
                <router-link :to="{name:'store-list',params:{businessId:businessId,productId:productId}}">
                    <div class="store-head hb">
                        <span>适用门店({{shop.shopSum}})</span>
                        <div class="fr">
                            <i class="iconfont icon-right"></i>
                        </div>
                    </div>
                </router-link>
                <div class="store-lately">
                    <store-item :storeInfo="shopList" :longHide="true"></store-item>
                </div>
            </section>


              <section>
                <div class="package-head hb">
                    <span>套餐内容</span>
                </div>
                <div class="package-content bc">
                    <div v-for="item in setMeal.list" class="package-list">
                        <span class="package-name">{{item.title}}</span>
                        <div class="package-rule fr"><span class="tl">{{item.time|price_format}}{{item.unitName}}</span><span class="tr">{{item.price|price_format}}元</span></div>
                    </div>
                    <div class="package-sum">
                        <div class="package-rule fr"><span class="tl">原价</span><span class="tr">{{setMeal.originalPrice|price_format}}元</span></div>
                    </div>
                    <div class="package-sum">
                        <div class="package-rule fr"><span class="tl">特惠价</span><span class="tr">{{setMeal.price|price_format}}元</span></div>
                    </div>
                </div>
                <router-link :to="{name:'graphic-details',params:{businessId:businessId,productId:productId}}">
                    <div class="store-detail hb">
                        <span>查看图文详情</span>
                        <div class="fr">
                            <i class="iconfont icon-right"></i>
                        </div>
                    </div>
                </router-link>
            </section>
    
            <section>
                <div class="notice-head hb">
                    <span>购买须知</span>
                </div>
                <div class="notice-contain bc">
                    <div class="notice-list">
                        <span class="notice-title">有效时间:</span>
                        <span class="notice-con">{{enablEndTime}}</span>
                    </div>
                    <div class="notice-list">
                        <span class="notice-title">使用时间:</span>
                        <span class="notice-con">{{buyNotes.useTime}}</span>
                    </div>
                    <div class="notice-list">
                        <span class="notice-title">预约提示:</span>
                        <span class="notice-con">{{buyNotes.subscribePrompt}}</span>
                    </div>
                    <div class="notice-list">
                        <span class="notice-title">使用人数:</span>
                        <span class="notice-con">{{buyNotes.useNumber}}</span>
                    </div>
                    <div class="notice-list">
                        <span class="notice-title">温馨提示:</span>
                        <ul class="notice-con">
                            <li>
                                <span>·</span> {{buyNotes.kindlyReminder}}
                            </li>
                        </ul>
                    </div>
                    <div class="notice-list" v-if="buyNotes.giftDesc">
                        <span class="notice-title">影票说明:</span>
                        <ul class="notice-con">
                            <li>
                                <span>·</span> {{buyNotes.giftDesc}}
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
    
            <section class="comment-part" v-if="comment.commentSum>0">
                <router-link :to="{name:'comment-list',params:{productId:productId}}">
                    <div class="part-head hb">
                        <span>评论({{comment.commentSum}})</span>
                        <div class="fr">
                            <star-rating :ratingNum="star"></star-rating>
                            <span class="star-score">{{star || 0.0}}分</span>
                            <i class="iconfont icon-right fr"></i>
                        </div>
                    </div>
                </router-link>
    
                <div class="comment-contain">
                    <div class="comment-content">
                        <comment-row :commentList="commentList"></comment-row>
                        <div class="more">
                            <router-link v-if="commentList&&commentList.length>0" :to="{name:'comment-list',params:{productId:productId}}">
                                <button type="button" routert>查看全部评论</button>
                            </router-link>
                            <button v-if="!commentList||commentList.length===0" type="button" routert>暂无评论</button>
                        </div>
                    </div>
                </div>
            </section>
    
            <section class="buy-tab">
                <div class="fl">
                    <span class="special-offer">
                        ￥
                        <span class="special-price">{{price|price_format}}</span>
                    </span>
                    <span class="original-price pm">￥{{originalPrice|price_format}}</span>
                </div>
                <button type="button" class="fr saleing" v-show="status.isBegin" @click="buy">立即购买</button>
                <button type="button" class="fr sale-time" v-show="!status.isBegin">{{saleTime}}开售</button>
            </section>
            
        </main>
    
    </div>
</template>

<script>
import GoBack from '@/components/GoBack'
import StarRating from '@/components/StarRating';
import CommentRow from '@/components/CommentRow'
import StoreItem from '@/components/StoreItem';
import SocialShare from '@/components/SocialShare';
export default {
    name: 'serve-detail',
    data() {
        return {
            businessId: 1,
            productId: 1,
            banner: [],
            title: '',
            price: '',
            originalPrice: '',
            soldOut: '',
            limits: [],
            comment: {},
            star: '',
            starNum: 0,
            shop: {},
            shopList: [],
            setMeal: {},
            buyNotes: {},
            // enablStartTime:'',
            enablEndTime: '',
            commentList: [],
            status: {},
            saleTime: '',
            shareConfig:{
                title:'这是分享标题',
                link:'http://haokur.com',
                imgUrl:'http://fun.assets.smi170.com/FhnYE-IM6nbdABpap8vbgoK03wbi',
                desc:'这是描述信息'
            }
        }
    },
    components: {
        'go-back': GoBack,
        'star-rating': StarRating,
        'comment-row': CommentRow,
        'store-item': StoreItem,
        'social-share':SocialShare
    },
    mounted() {
            // var isPageHide = false;
            // window.addEventListener('pageshow', function () {
            //     if (isPageHide) {
            //         window.location.reload();
            //     }
            // });
            // window.addEventListener('pagehide', function () {
            //     isPageHide = true;
            // });
        console.log(this.$_config.isApp)
        this.businessId = this.$route.params.businessId;
        this.productId = this.$route.params.productId;
        this.getServeInfo();
        this.getComment();
        setTimeout(() => {
            document.body.scrollTop = 0;
        }, 500)
    },
    methods: {
        getServeInfo(id) {
            this.$_api.post({
                'ext': 'product/product-info',
                'product_id': this.productId
            }, true, false)
                .then(res => {
                    if (res.code == 1) {
                        var data = res.data;
                        this.banner = data.items;
                        this.title = data.title;
                        this.price = data.price;
                        this.originalPrice = data.originalPrice;
                        this.limits = data.limits;
                        this.soldOut = data.soldOut;
                        this.comment = data.comment;
                        this.star = Number(data.comment.star).toFixed(1) || '0.0';
                        this.starNum = Math.floor(Number(data.comment.star));
                        this.shop = data.shop;
                        this.shopList = data.shop.list[0];
                        this.setMeal = data.setMeal;
                        this.buyNotes = data.buyNotes;
                        // this.enablStartTime= data.buyNotes.enablEndTime.split(' ')[0];
                        this.enablEndTime= data.buyNotes.enablEndTime;
                        this.status = data.status;
                        this.saleTime = data.status.date.split(' ')[0];
                    }
                })
                .finally(() => {

                })
        },
        getComment(id) {
            this.$_api.post({
                'ext': 'comment/product-page',
                'goodsId': this.productId,
                'pageNum': 1,
                // 'commentType':'',
                'pageSize': 3
            }, null, false)
                .then(res => {
                    if (res.code == 1) {
                        var data = res.data;
                        this.commentList = res.data.list;
                    }
                })
                .finally(() => {

                })
        },
        buy() {
            this.$_api.auth()
                .then(userinfo => {
                    this.$router.push({
                        path: `/submit-order/${this.businessId}/${this.productId}`,
                    });
                })
                .catch(error => {
                    console.log(error);
                })

        }
    }
}

</script>
<style lang="scss" src="./serve-detail.scss" scoped></style>