<template>
    <div class="graphic-details-page">
        <header class="smi-header">
            <go-back></go-back>
            <h2>图文详情</h2>
        </header>
        <main class="smi-content">
            <section class="graphic" v-html="content">
                {{content}}
            </section>
            <section class="buy-tab">
                <div class="fl"><span class="special-offer">￥<span class="special-price">{{price|price_format}}</span></span>
                    <span class="original-price pm">￥{{originalPrice|price_format}}</span></div>
                <button type="button" class="fr saleing" v-show="isBegin" @click="buy">立即购买</button>
                <button type="button" class="fr sale-time" v-show="!isBegin">{{saleTime}}开售</button>
            </section>
        </main>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import GoBack from '@/components/GoBack';
    import LoadMore from '@/components/LoadMore.vue';

    export default {
        name: 'graphic-details',
        components: {
            'load-more': LoadMore,
            'go-back': GoBack
        },
        data() {
            return {
                productId: '',
                businessId: '',
                content: '',
                price: '',
                originalPrice: '',
                isBegin: '',
                saleTime: '2017-1-1',
            }
        },
        computed: {

        },
        mounted() {
            this.productId = this.$route.params['productId'];
            this.businessId = this.$route.params['businessId'];
            this.getGraphicdetails();
        },
        methods: {
            getGraphicdetails() {
                this.$_api.post({
                    'ext': "product/product-details",
                    'product_id': this.productId
                }, true, false)
                    .then(res => {
                        console.log(res);
                        var data = res.data;
                        this.content = data.content;
                        this.price = data.price;
                        this.originalPrice = data.originalPrice;
                        this.isBegin = data.isBegin;
                        this.saleTime = data.date.split(' ')[0];
                    })
                    .finally(() => {
                        window.scrollTo(0,20);
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
<style lang="scss" src="../serve-detail/serve-detail.scss" scoped></style>