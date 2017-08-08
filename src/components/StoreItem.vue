<template>
    <div class="store-wrap" v-if="storeInfo">
      <div class="store-info" @click="goMapGuide(storeInfo.longitude,storeInfo.latitude)">
        <div class="info-wrap">
          <div class="cl info-title">
            <h4>{{storeInfo.name||'商品名称'}}</h4>
          </div>
          <div class="store-location">
             <i class="iconfont icon-diliweizhi"></i>
             <div class="store-location-content">
              <div class="store-location-adress" :class="{'ell':longHide}">{{storeInfo.address}}</div> 
              <div class="store-distance">距离您:<span>{{storeInfo.distance}}</span></div>
             </div>
          </div>
        </div>
      </div>
      <div class="store-call fr" @click="callStore(storeInfo.phone)">
        <i class="iconfont icon-dianhuaicon"></i>
      </div>
    </div>
</template>
<script>
export default {
  props: [
    'storeInfo',
    'businessId',
    'productId',
    'longHide',
  ],
  data() {
    return {

    }
  },
  mounted() {
    console.log(this.storeInfo)
  },
  methods: {
    goMapGuide(x, y) {
      this.$router.push({
        name: 'map-guide',
        params: {
          businessId:this.businessId,
          productId:this.productId,
          x, y
        }
      })
    },
    callStore(phoneNum) {
      window.open(`tel:${phoneNum}`);
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../themes/_variable.scss' ;
@import '../themes/_basic.scss' ;
.store-wrap{
  position: relative;
}
.store-info {
  // padding: 10px $sp_main;
  padding-right: 60px;
  .info-wrap {
    border-right: 1px solid $c_border;
    padding-right: 10px;
  }
  .info-title {
    position: relative;
    h4 {
      font-size: 14px;
      padding-right: 60px;
      line-height: 20px;
    }
  }
  .store-location {
    margin-top: 4px;
    i {
      display: inline-block;
      font-size: 20px;
      color: $c_font_dark;
      transform: translateY(2px);
      position: absolute;
    }
    .store-location-content{
      padding-left:20px;
    }
    .store-location-adress{
      font-size: 13px;
      line-height: 22px;
      color: $c_font_dark;
      padding-top:2px;
    }
    .store-distance {
      font-size: 13px;
      line-height: 20px;
      color: $c_font_dark;
      span{
        color: $c_theme_main;
      }
    }
  }
}

.store-call {
  position: absolute;
  top: 50%;
  right: 0px;
  width: 60px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  transform: translate3d(0, -50%, 0);
  i {
    font-size: 30px;
    color: $c_theme_main;
  }
}
</style>
