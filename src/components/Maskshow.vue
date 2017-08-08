<template>
    <div>
        <div class="app-mask" v-show="maskShow"></div>
    </div>
</template>
<script>
    export default {
        props: [
            'maskShow'
        ],
        data() {
            return {

            }
        },
        mounted() {
        },
        methods: {
        }
    }

</script>
<style lang="scss" scoped>
.app-mask{
    position: fixed;
    top: 0;
    left:0;
    width:100%;
    height:100%;
    z-index:10;
    background: #fff;
}
</style>