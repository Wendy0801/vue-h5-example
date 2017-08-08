<template>
  <div>

    <div v-if="!$_config.isSmiApp">
      <div v-if="hashNow!==enterHash" class="smi-header-icon smi-header-icon-left" @click="goBack">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <div v-if="hashNow===enterHash" class="smi-header-icon smi-header-icon-left" @click="goHome">
        <i class="iconfont icon-shouye"></i>
      </div>
    </div>

    <div v-if="$_config.isSmiApp">
      <!-- 普通H5返回  -->
      <a v-if="url!=='exitApp'" class="smi-header-icon smi-header-icon-left" @click="goBack">
        <i class="iconfont icon-fanhui"></i>
      </a>
      <!-- app的退出h5  -->
      <a v-if="url==='exitApp'" class="smi-header-icon smi-header-icon-left" @click="exitApp()">
        <i class="iconfont icon-fanhui">E</i>
      </a>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'GoBack',
    props: [
      'isApp',
      'url',
      'title'
    ],
    data() {
      return {
        hashNow: '',
        // enterHash:''
      }
    },
    computed: {
      ...mapGetters({
        'enterHash': 'getEnterHash',
      })
    },
    mounted() {
      this.hashNow = window.location.hash;
      // this.$_config.isSmiApp = true
      // console.log(this.enterHash)
    },
    methods: {
      goBack() {
        this.$router.back();
        // this.$router.go(-2)
      },
      goHome() {
        this.$router.push({ 'path': '/' });
        this.$store.dispatch('SET_ENTER_HASH', '');
      },
      exitApp(){
        // alert()
        window.location = "smilife://goLastPage"
      }
    },
    beforeDestroy() {
      // alert('销毁了')
    },
    beforeRouteLeave(to, from, next) {
    }
  }

</script>
<style lang="scss">

</style>