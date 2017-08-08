<template>
	<div class="store-list-page">
		<header class="smi-header">
			<go-back></go-back>
			<h2>门店列表</h2>
		</header>
		<main class="smi-content">
			<div class="store-wrap">
				<div class="store-header">
					{{total}}家门店通用
				</div>
				<ul class="store-list" v-infinite-scroll="loadMoreStore" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
					<li class="store-item cl" v-for="(store,index) in storeList" :key="index">
                   		<store-item :storeInfo="store" :businessId="business_id" :productId="product_id"></store-item>
					</li>                        
				</ul>
			</div>
			<load-more :loading="loading" :allLoaded="allLoaded"></load-more>
		</main>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
import GoBack from '@/components/GoBack';
import LoadMore from '@/components/LoadMore.vue';
import StoreItem from '@/components/StoreItem';


export default {
	name: 'store-list',
	components: {
		'load-more': LoadMore,
		'go-back': GoBack,
		'store-item': StoreItem,
	},
	data() {
		return {
			storeList: [],
			total: 0,
			business_id: 0,
			product_id: 0,
			pSize: 10,
			loading:true,
			allLoaded:false,
		}
	},
	computed: {
		...mapGetters({
		})
	},
	mounted() {
		this.business_id = this.$route.params.businessId;
		this.product_id = this.$route.params.productId;
		this.getStoreList();
	},
	methods: {
		getStoreList(pIndex = 1) {
			this.loading = true;
			this.$_api.post({
				ext: 'product/shop-page',
				// business_id: this.business_id,
				product_id: this.product_id,
				pageNum: pIndex,
				pageSize: this.pSize
			}, null, true)
				.then(res => {
					if (res.code === 1) {
						if (res.data.list.length < this.pSize) {
							this.allLoaded = true;
						}
						this.loading = false;
						this.storeList = this.storeList.concat(res.data.list);
						this.total = res.data.total;
					}
				})
		},
		loadMoreStore(){
			if (this.allLoaded) {
				return false;
			}
			var nextIndex = Math.ceil(this.storeList.length / this.pSize) + 1;
			this.getStoreList(nextIndex);
		},
		goMapGuide(x, y) {

			this.$router.push({
				name: 'map-guide',
				params: {
					'businessId':this.business_id,
					'productId':this.product_id,
					x, y
				}
			})
		},
		callStore(phoneNum) {
			// console.log(phoneNum)
			window.open(`tel:${phoneNum}`);
		}
	}
}
</script>
<style lang="scss" src="./store-list.scss" scoped></style>
