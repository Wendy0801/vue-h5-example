<template>
    <ul class="comment-list">
        <li class="comment-row" v-for="item in commentList">
            <div class="user-info bm">
                <div class="user-avatar">
                    <img :src="item.avatar" v-show="item.avatar" />
                    <img src="../assets/icons/personal_icon_nouser_nor_2.png" v-show="!item.avatar">
                </div>
                <div class="user-name">
                    <p class="user-number">{{item.custName || '无昵称'}}</p>
                    <p class="lc">{{item.commentTime | dateFilter}}</p>
                </div>
                <star :starNum="item.starLevelGrade"></star>
            </div>
            <p class="user-comment bm ml" v-show="item.commentContent">{{item.commentContent}}</p>
            <div class="user-photo ml" v-show="item.attachmentList  && item.attachmentList .length>0">

                <ul>
                    <li v-for="(photo,index) in item.attachmentList"><img :src="photo.fileUrl" class="preview-img" @click="previewImg(index,item.attachmentList)"></li>
                </ul>
            </div>
            <p class="user-address lc mp"><i class="iconfont icon-diliweizhi"></i><span>{{item.shopName}}</span></p>
        </li>
    </ul>
</template>

<script>
    import Vue from 'vue';
    import VuePreview from 'vue-preview';
    Vue.use(VuePreview);
    import Star from '@/components/Star'
    export default {
        name: 'ul-comment',
        data() {
            return {
                photoList: [],
            }
        },
        props: [
            'commentList'
        ],
        components: {
            'star': Star,
        },
        mounted() {
            console.log(this.commentList);
        },
        methods: {
            previewImg(index, ImgList) {
                this.photoList = [];
                for (var i = 0; i < ImgList.length; i++) {
                    this.photoList.push(ImgList[i].fileUrl);
                }
                // 获取尺寸
                var _dealList = [];
                var _loadedCount = 0;
                var self = this;
                var imgList = this.photoList;
                imgList.map((item, index) => {
                    var _img = new Image();
                    _img.src = item;
                    _img.onload = function () {
                        _loadedCount++;
                        _dealList.push({
                            src: item,
                            w: _img.width,
                            h: _img.height
                        })
                        if (_loadedCount === imgList.length) {
                            _configPreview();
                        }
                    }
                    _img.onerror = function () {
                        _loadedCount++;
                        _dealList.splice(index, 0, {
                            src: '../../assets/images/default1.jpg',
                            w: 100,
                            h: 100
                        })
                        if (_loadedCount === imgList.length) {
                            _configPreview();
                        }
                    }
                })



                function _configPreview() {
                    console.log(_dealList);
                    self.$preview.open(index, _dealList, {
                        history: true
                    })
                }

                // this.$preview.open(index, this.picList, {
                //   history: true
                // })
            },
        }

    }

</script>
<style lang="scss" scoped>
    .ml {
        margin-left: 15px;
    }
    
    .mp {
        margin-left: 11px;
    }
    
    .comment-contain .comment-content ul:after {
        display: block;
        content: "clear";
        height: 0;
        clear: both;
        overflow: hidden;
        visibility: hidden;
    }
    
    .comment-contain .comment-list {
        padding: 10px 0px;
    }
    
    .comment-contain .comment-row {
        padding: 10px 15px;
        border-bottom: 1px solid #f3f5f7;
    }
    
    .comment-contain .comment-row:first-child {
        padding-top: 0px;
    }
    
    .comment-contain .comment-row:last-child {
        border-bottom: 0;
        padding-bottom: 0px;
    }
    
    .comment-contain .user-info:after {
        display: block;
        content: "clear";
        height: 0;
        clear: both;
        overflow: hidden;
        visibility: hidden;
    }
    
    .comment-contain .user-info div {
        float: left;
    }
    
    .comment-contain .user-info div.star {
        float: right;
    }
    
    .comment-contain .user-address {
        position: relative;
    }
    
    .comment-contain .user-address i {
        font-size: 20px;
        position: absolute;
        left: 0;
        top: -4px;
    }
    
    .comment-contain .user-address span {
        font-size: 11px;
        margin-left: 20px;
    }
    
    .comment-contain .user-avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
    }
    
    .comment-contain .user-name {
        padding: 7px 9px;
    }
    
    .comment-contain .user-name .user-number {
        margin-bottom: 5px;
    }
    
    .comment-contain .user-photo ul li:after {
        display: block;
        content: "clear";
        height: 0;
        clear: both;
        overflow: hidden;
        visibility: hidden;
    }
    
    .comment-contain .user-photo ul li {
        float: left;
        width: 22%;
        margin-right: 4%;
        margin-bottom: 9px;
        height: 70px;
    }
    
    .comment-contain .user-photo ul li img {
        width: 100%;
        height: 70px;
    }
    
    .comment-contain .user-photo ul li:nth-child(4n) {
        margin: 0;
    }
    
    .comment-contain .bm {
        margin-bottom: 6px;
    }
    
    .comment-contain .lc {
        color: #999;
        font-size: 12px;
    }
</style>