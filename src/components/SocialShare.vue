<template>
  <div>
      <div v-if="$_config.isSmiApp" class="smi-header-icon smi-header-icon-right" @click="goAppShare()">
        <i class="iconfont icon-fenxiang3"></i>
      </div>
  </div>
</template>
<script>
export default {
  props: [
    "config"
  ],
  data() {
    return {
    }
  },
  mounted() {
    if(this.$_config.isWechat){
      this.$_social.shareConfig(this.config)
    }
  },
  methods: {
    goAppShare(){
      this.$_social.goAppShare(this.config)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../themes/_variable.scss' ;
@import '../themes/_basic.scss' ;

</style>
