<template>
    <div class="submit-success-page">
        <header class="smi-header">
            <go-back></go-back>
            <h2>评价成功</h2>
            <span class="fr">完成</span>
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
  name:'submit-success',
  components: {
    'load-more': LoadMore,
    'go-back': GoBack
  },
  data(){
      return {

      }
  },
  computed: {
    ...mapGetters({
    })
  },
  mounted(){

  },
  methods : {

  }
}
</script>
<style lang="scss" src="./submit-success.scss" scoped></style>
