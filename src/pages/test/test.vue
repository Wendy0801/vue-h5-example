<template>
    <div class="test-page">
        <header class="smi-header">
            <go-back></go-back>
            <h2>test</h2>
        </header>
        <main class="smi-content">
            <!-- <wx-auto-login :debug="true"></wx-auto-login> -->
            <mt-datetime-picker v-model="pickerVisible" type="date" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日">
            </mt-datetime-picker>
        </main>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import GoBack from '@/components/GoBack';
import LoadMore from '@/components/LoadMore.vue';
import WxAutoLogin from '@/components/WxAutoLogin'

export default {
    name: 'test',
    components: {
        'load-more': LoadMore,
        'go-back': GoBack,
        'wx-auto-login': WxAutoLogin
    },
    data() {
        return {
            pickerValue: '',
            pickerVisible:''
        }
    },
    computed: {
        ...mapGetters({
        })
    },
    mounted() {

    },
    methods: {

    }
}
</script>
<style lang="scss" src="./test.scss" scoped></style>
