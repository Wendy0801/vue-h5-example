<template>
  <div class="rating-wrap">
    <div class="rating-default">
      <i v-for="n in 5" class="iconfont icon-xing" :key="n"></i>
    </div>
    <div class="rating-active" :style="`width:${ratingActive}%`">
      <div class="rating-active-inner">
        <i v-for="n in 5" class="iconfont icon-xing" :key="n"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: [
    'ratingNum'
  ],
  data() {
    return {

    }
  },
  computed: {
    'ratingActive': function () {
      // this.ratingNum  = 2;
      console.log(parseFloat(this.ratingNum))
      console.log(Math.ceil(parseFloat(this.ratingNum) / 5 * 100))
      return Math.ceil(parseFloat(this.ratingNum) / 5 * 100);
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>
@import '../themes/_variable.scss';
@import '../themes/_basic.scss';
.rating-wrap {
  position: relative;
  @extend %mid;
}

.rating-active {
  position: absolute;
  color: $c_theme_main;
  overflow: hidden;
  top: 0;
  left: 0;
}
.rating-active-inner{
  // position: absolute;
  // left:0;
  // top:0;
  width:120px;
}

.rating-default {
  // position: absolute;
  color: $c_font_tip;
}
</style>
