<template>
    <div class="edit-comment-page">
        <header class="smi-header">
            <go-back></go-back>
            <h2>edit-comment</h2>
        </header>
        <main class="smi-content">

        </main>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import GoBack from '@/components/GoBack';
import LoadMore from '@/components/LoadMore.vue';

export default {
  name:'edit-comment',
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
<style lang="scss" src="./edit-comment.scss" scoped></style>
