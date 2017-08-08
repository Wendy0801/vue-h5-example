<template>
    <div class="submit-success-page">
        <header class="smi-header">
            <go-back></go-back>
            <h2>评价成功</h2>
            <a href="javascript:;" class="smi-header-icon smi-header-icon-right" @click="goOrderDetail()">完成</a>
        </header>
        <main class="smi-content">
            <section>
                <i class="iconfont icon-zhengque1"></i>
                <div>评价成功</div>
            </section>
        </main>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import GoBack from '@/components/GoBack';
    import LoadMore from '@/components/LoadMore.vue';

    export default {
        name: 'submit-success',
        components: {
            'load-more': LoadMore,
            'go-back': GoBack
        },
        data() {
            return {
                orderId: 1,
            }
        },
        computed: {
    ...mapGetters({
            })
        },
        mounted() {
            this.orderId = this.$route.params['orderId'];
        },
        methods: {
            goOrderDetail() {
                this.$_api.skipPage()
                    .then(() => {
                        this.$router.push({
                            path: `/order-detail/${this.orderId}`
                        })
                    });
            }
        }
    }

</script>
<style lang="scss" src="./comment-success.scss" scoped></style>