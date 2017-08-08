<template>
  <!-- App -->
  <div id="app" class="app" :class="{'h5-in-app':$_config.isSmiApp,'h5-in-wechat':$_config.isWechat}">
     <!--<div style="height:100px"></div> -->
    <router-view></router-view>
    <transition name="fade">
      <loading v-show="loadingNow"></loading>
    </transition>
    <mt-popup v-model="popupVisible" position="top" class="mint-popup-2" :class="popupClass" :modal="false">
      <p>{{message}}</p>
    </mt-popup>
    <wx-auto-login :debug="false"></wx-auto-login>
    <!--<mask-show :maskShow="maskingNow"></mask-show>-->
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Loading from '@/components/Loadding';
import WxAutoLogin from '@/components/WxAutoLogin'
import Maskshow from '@/components/Maskshow'
export default {
  components: {
    'loading': Loading,
    'wx-auto-login':WxAutoLogin,
    'mask-show':Maskshow,
  },
  data() {
    return {
      popupVisible: false,
      popupClass: 'info',
      message: '操作成功',
      showMusicPlayer: false,
      musicBarDeg: 0,
    }
  },
  computed: {
    ...mapGetters({
      loadingNow: 'getLoadingStatu',
      actionStatu: 'getActionStatu',
      userinfo: 'getUserinfo',
      isWechat: 'getIsWechat',
      isApp: 'getIsApp',
      test: 'getTestNum',
      maskingNow:'getMask',
    }),
    ...mapState({ hh: 'count' })
  },
  watch: {
    'actionStatu': function () {
      this.type = this.actionStatu.type;
      this.popupClass = this.actionStatu.isFromApp
        ? `${this.actionStatu.type} mint-popup-app`
        : this.actionStatu.type;
      this.message = this.actionStatu.message;
      this.popupVisible = true;
      setTimeout(() => {
        this.popupVisible = false;
      }, 1500)
    }
  },
  mounted() {
    // 测试代码
    this.$_cookie.set({
      userInfo: '{"custId":"3131000000395858","custName":"smi_200","token":"OGI5ODdkNmItYjZmYi00MDhlLWI4NTUtOTQ5ZDZiMzhmOWIy"}'
    })
    
    this.getMyLocation();
    if(this.$_config.isSmiApp){
      this.initAppUserinfo()
      // this.$_cookie.set({
      //     'userInfo':''
      // },-24*60)
    }
  },
  methods: {
    initAppUserinfo(){
      window.initUser = (data)=>{
        console.log(data)
        var _userinfo = JSON.parse(data)
        if(_userinfo.token!==''){
          this.$_cookie.set({
            'userInfo':data
          })
        }
        else{
          this.$_cookie.set({
            'userInfo':data
          },-24*60)
        }
      }
      window.location = 'smilife://userInfo?callback=initUser'
    },
    getMyLocation() {
      if (this.$_cookie.get('position_x')) {
        return;
      }
      let baiduKey = this.$_config.baiduKey;
      this.$_api
        .jsonp(`http://api.map.baidu.com/location/ip?ak=${baiduKey}&coor=bd09ll`)
        .then(res => {
          // console.log(res)
          this.$_cookie.set({
            position_x: res.content.point.x,
            position_y: res.content.point.y,
            position_city: res.content.address_detail.city
          })
        })
        .catch(err => { })
    }
  }
}

</script>
<style lang="scss" scoped>
.fade-leave-active {
  opacity: 0;
  transition: all 0.5s ease
}
</style>