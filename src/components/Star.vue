<template>
    <div class="star">
        <span class="star-grey">
            <i v-for="n in 5" class="iconfont icon-xing"></i>
        </span>
        <span class="star-red">
            <i v-for="n in starNum" class="iconfont icon-xing"></i>
        </span>

    </div>
</template>

<script>
    export default {
        name: 'star',
        data() {
            return {

            }
        }, 
        props: [
            'starNum'
        ],
        mounted() {
            console.log(this.starNum)
        },
        methods: {

        }

    }

</script>
<style lang="scss" scoped>
    .hb .star {
        position: relative;
        top: 0px;
        display: inline-block;
        margin-right: 16px;
    }
    
    .hb .star i {
        font-size: 16px;
    }
    
    .user-info .star {
        position: relative;
        top: 5px;
        display: inline-block;
    }
    
    .user-info .star i {
        font-size: 12px;
    }
    
    .star .star-grey {
        left: 0;
        top: 0px;
        color: #CCCCCC;
    }
    
    .star .star-red {
        position: absolute;
        left: 0;
        top: 0px;
        color: #FF6300;
    }
</style>