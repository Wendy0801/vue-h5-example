<template>
	<div class="serve-list-page">
		<header class="smi-header">
			<go-back :url="'exitApp'" v-if="$_config.isSmiApp"></go-back>
			<h2>服务首页</h2>
		</header>
		<main class="smi-content">
			 <!-- <button @click="goPay()">模拟跳转</button>  -->
			<!-- <router-link class="link-button" :to="{'path':'order-list'}">
				临时订单列表
			</router-link> -->
			<div class="serve-wrap">
				<ul class="serve-list" v-infinite-scroll="loadMoreStore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
					<li class="serve-item" v-for="(shop ,index) in serveList" :key="index">
	
						<div class="shop-info cl">
							<div class="info-avatar fl">
								<img :src="shop.image" alt="">
							</div>
							<div class="info-about">
								<h3 class="info-title ell">{{shop.buinessTitle}}</h3>
								<div class="info-distance">
									<b>距离您:</b>
									<span>{{shop.distance}}</span>
								</div>
							</div>
						</div>
	
						<div class="shop-product">
							<ul class="product-list">
								<li class="product-item cl" v-for="(product,index) in shop.items" :key="index">
									<router-link :to="{name:'serve-detail',params:{businessId:shop.buinessId,productId:product.id}}">
										<div class="product-price fl">
											<div class="price-now cl">
												<span class="fl">￥</span>
												<i class="fl">{{product.price|price_format}}</i>
											</div>
											<div class="price-before">
												原价:￥{{product.originalPrice|price_format}}
											</div>
										</div>
										<div class="product-info">
											<h4 class="product-title ell">
												{{product.title}}
											</h4>
											<div class="product-sales">
												已售{{product.soldOut}}
											</div>
										</div>
									</router-link>
								</li>
							</ul>
						</div>
					</li>
				</ul>
				<load-more :loading="loading" :allLoaded="allLoaded"></load-more>
			</div>
		</main>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import GoBack from '@/components/GoBack';
import LoadMore from '@/components/LoadMore.vue';

export default {
	name: 'serve-list',
	components: {
		'load-more': LoadMore,
		'go-back': GoBack
	},
	data() {
		return {
			pSize: 1,
			loading: true,
			allLoaded: false,
			serveList: [],
			locationPoint: {
				x: 0,
				y: 0
			},
		}
	},
	computed: {
		...mapGetters({
		})
	},
	mounted() {
		this.getServeList();
		this.$_social.shareConfig({
			'title': '燃爆城市上空的MMA笼斗女神海选正式开启！',
			'link': location.origin + location.pathname+'#/',
			'imgUrl': 'http://fun.assets.smi170.com/FkRqFeo35CpoxpBgfUJYI552xOVn',
			'desc': '这可能是一份比维密天使更有价值的职业，用你高举数字牌的双手、健美的身姿、自信闪亮的笑容点燃这场竞技！'
		})
	},
	methods: {
		open(picker) {
			this.$refs[picker].open();
		},
		getServeList(pIndex = 1) {
			this.$_api.post({
				ext: 'product/product-home-page',
				pageNum: pIndex,
				pageSize: this.pSize
			}, null, true)
				.then(res => {
					if (res.code === 1) {
						if (res.data.list.length < this.pSize) {
							this.allLoaded = true;
						}
						this.loading = false;
						this.serveList = this.serveList.concat(res.data.list);
					}
				})
				.finally(() => { })
		},
		loadMoreStore() {
			if (this.allLoaded) {
				return false;
			}
			var nextIndex = Math.ceil(this.serveList.length / this.pSize) + 1;
			this.getServeList(nextIndex);
		},
		goPay(){
			var state = { 
				title : "HTML 5 History API simple demo",
				url : "/#/map-guide/"
			};
			history.replaceState({}, "", '/#/store-list/1/1');
			this.$router.push({
				path:'/pay-center/1'
			})	
		}
	},
	beforeDestroy(){
	}
}
</script>
<style lang="scss" src="./serve-list.scss" scoped></style>
