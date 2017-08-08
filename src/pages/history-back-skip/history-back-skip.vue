<template>
    <div class="history-back-skip-page">
        <header class="smi-header">
            <go-back></go-back>
            <h2>跳转中...</h2>
        </header>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import GoBack from '@/components/GoBack';
import LoadMore from '@/components/LoadMore.vue';

export default {
    name: 'history-back-skip',
    components: {
        'load-more': LoadMore,
        'go-back': GoBack
    },
    data() {
        return {

        }
    },
    computed: {
        ...mapGetters({
        })
    },
    mounted() {
        // window.history.go(-1)
    },
    methods: {
        
    }
}
</script>
<style lang="scss" src="./history-back-skip.scss" scoped></style>
