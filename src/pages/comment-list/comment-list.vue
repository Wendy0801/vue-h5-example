<template>
  <div class="comment-page">
    <header class="smi-header">
      <go-back></go-back>
      <h2>评价</h2>
    </header>
    <main class="smi-content">
      <div v-if="orderCommentTypeCount && orderCommentTypeCount.totalCount>0">
        <section class="comment-nav">
          <ul>
            <li :class="{'active':tabType==='total'}" @click="changeCommentType('total',0)">
              <div>全部
                <span>({{orderCommentTypeCount.totalCount}})</span>
              </div>
            </li>
            <li :class="{'active':tabType==='good'}" @click="changeCommentType('good',1)">
              <div>好评
                <span>({{orderCommentTypeCount.goodComment}})</span>
              </div>
            </li>
            <li :class="{'active':tabType==='bad'}" @click="changeCommentType('bad',2)">
              <div>差评
                <span>({{orderCommentTypeCount.badComment}})</span>
              </div>
            </li>
            <li :class="{'active':tabType==='pic'}" @click="changeCommentType('pic',0)">
              <div>晒图
                <span>({{orderCommentTypeCount.picComment}})</span>
              </div>
            </li>
          </ul>
        </section>

        <section class="comment-contain">
          <div class="comment-content" v-infinite-scroll="loadMoreComment" infinite-scroll-disabled="loading" infinite-scroll-distance="10">
            <comment-row :commentList="commentList"></comment-row>
          </div>

        </section>
        <load-more :loading="loading" :allLoaded="allLoaded"></load-more>
      </div>
      <div class="no-comment" v-else>
        <div class="no-comment-con">
          <img src="../../assets/icons/pic_no-data.png" alt="" />
          <p>竟然一条评论都没有</p>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import GoBack from '@/components/GoBack'
  import Star from '@/components/Star'
  import CommentRow from '@/components/CommentRow'
  import LoadMore from '@/components/LoadMore.vue';
  export default {
    data() {
      return {
        productId: 1,
        tabType: 'total',
        commentList: [],
        orderCommentTypeCount: {},
        commentType: 0,
        pageNum: 1,
        pageSize: 30,
        loading: true,
        allLoaded: false,
        total: 0
      }
    },
    computed: {
    },
    components: {
      'go-back': GoBack,
      'star': Star,
      'comment-row': CommentRow,
      'load-more': LoadMore
    },
    mounted() {
      this.productId = this.$route.params['productId'];
      this.getComment();
    },
    methods: {
      getComment() {
        if (this.tabType == 'total') {
          this.$_api.post({
            'ext': 'comment/product-page',
            'goodsId': this.productId,
            'commentType': this.commentType,
            'pageNum': this.pageNum,
            'pageSize': this.pageSize
          }, null, false)
            .then(res => {
              if (res.code == 1) {
                this.getInfo(res.data);
              }
            })
            .finally(() => {

            })
        } else {
          this.$_api.post({
            'ext': 'comment/product-page',
            'goodsId': this.productId,
            'commentType': this.commentType,
            'isPic': this.tabType == 'pic' ? 1 : 0,
            'pageNum': this.pageNum,
            'pageSize': this.pageSize
          }, null, false)
            .then(res => {
              if (res.code == 1) {
                this.getInfo(res.data);
              }
            })
            .finally(() => {

            })
        }

      },
      getInfo(data) {
        this.commentList = this.commentList.concat(data.list);
        this.orderCommentTypeCount = data.orderCommentTypeCount;
        this.total = data.total;
        this.loading = false;
        if (data.list.length < this.pageSize) {
          this.allLoaded = true;
        }
      },
      loadMoreComment() {
        if (this.allLoaded) {
          return false;
        }
        this.pageNum = Math.ceil(this.commentList.length / this.pageSize) + 1;
        this.getComment();
      },
      changeCommentType(tab, type) {
        this.loading = true;
        this.allLoaded = false;
        this.commentList = [];
        this.tabType = tab;
        this.commentType = type;
        this.getComment();
      }
    }
  }

</script>
<style lang="scss" src="./comment-list.scss" scoped></style>