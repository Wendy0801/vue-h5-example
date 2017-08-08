<template>
    <div class="submit-comment-page">
        <header class="smi-header">
            <go-back></go-back>
            <h2>评价订单</h2>
        </header>
        <main class="smi-content">
            <section class="margin-bottom sh spacing">
                <span class="st">商家</span>
                <span>{{shopName}}</span>
            </section>
            <section class="margin-bottom">
                <div class="sh bottom-border spacing">
                    <span class="st fl">总分</span>
                    <div class="star fl">
                        <span class="star-grey">
                            <i v-for="n in 5" class="iconfont icon-xing" @click="starComment(n)"></i>
                        </span>
                        <span class="star-red">
                            <i v-for="n in starNum" class="iconfont icon-xing" @click="starComment(n)"></i>
                        </span>

                    </div>
                    <span class="fr" v-if="starNum==1">非常差</span>
                    <span class="fr" v-if="starNum==2">比较差</span>
                    <span class="fr" v-if="starNum==3">一般</span>
                    <span class="fr" v-if="starNum==4">较好</span>
                    <span class="fr" v-if="starNum==5">非常好</span>
                </div>
                <div class="comment-label spacing">
                    <span v-for="(item,index) in labelList" @click="selectLabel(item.commentTagId,index,$event)">{{item.commentTagContent}}</span>
                    <!--<span>高大上</span><span>高大上</span><span>高大上</span>-->
                </div>
                <div class="spacing cf">
                    <textarea class="fr" placeholder="说说您的消费感受吧。您的意见很重要，写够15字的都是好人。" v-model="content" maxlength="100" @keyup="sum"></textarea>
                </div>
            </section>
            <section class="spacing">
                <div class="photo-list">
                    <div class="photo fl" v-for="(item,index) in uploadImg">
                        <span v-show="isComment"><i class="iconfont icon-cuo" @click="deleteImg(index)"></i></span>
                        <img :src='item.fileUrl' alt="" />
                    </div>
                    <div class="upload fl" v-show="isComment"><input type="file" @change="uploadFile($event)"></div>
                </div>
            </section>
            <section class="sh comment-submit" v-show="isComment">
                <button @click="submitComment">确认发布</button>
            </section>
            <section class="comment-mask" v-show="!isComment"></section>
        </main>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex';
    import { Indicator, MessageBox } from 'mint-ui';
    import GoBack from '@/components/GoBack';
    import {
        QINIU_BASE_URL
    } from '../../services/config'
    export default {
        name: 'submit-comment',
        components: {
            'go-back': GoBack
        },
        data() {
            return {
                token: '',
                domain: '',
                url: '',
                businessId: 1,
                orderId: 1,
                custId: '',
                shopName: '',
                shopId: '',
                labelList: [],
                labelId: [],
                uploadImg: [],
                starNum: '',
                content: '',
                isComment: true,
                status: ''


            }
        },
        computed: {
        },
        mounted() {
            this.orderId = this.$route.params['orderId'];
            this.status = this.$route.params['status'];
            this.getOrderInfo();
            this.getQiniuConfig();
        },
        methods: {
            getQiniuConfig: function () {
                this.$_api.get({
                    'ext': QINIU_BASE_URL
                }).then(res => {
                    this.token = res.uptoken;
                    this.domain = res.domain;
                })
            },
            getOrderInfo() {
                if (this.status == 3) {
                    //待评论
                    this.isComment = true;
                    this.wait();
                } else if (this.status == 4) {
                    //已完成
                    this.isComment = false;
                    this.complete();
                }

            },
            wait() {
                this.$_api.post({
                    'ext': 'my-info/order-shopInfo',
                    'orderId': this.orderId
                }, null, false, true).then(res => {
                    if (res.code == 1) {
                        var data = res.data;
                        this.shopId = data.shopId;
                        this.shopName = data.shopName;
                        this.businessId = data.businessId
                    }

                }).finally(() => {

                })
            },
            complete() {
                this.$_api.post({
                    'ext': 'my-info/order-comment-form',
                    'orderId': this.orderId
                }, true, false, true).then(res => {
                    if (res.code == 1) {
                        var data = res.data;
                        this.showInfo(data);
                    }

                }).finally(() => {

                })
            },
            showInfo(data) {
                console.log(data);
                this.custId = data.custId;
                this.shopId = data.shopId;
                this.shopName = data.shopName;
                this.starNum = data.starLevelGrade;
                this.labelList = data.orderCommentTagList;
                this.content = data.commentContent;
                this.uploadImg = data.attachmentList;
                this.businessId = data.businessId;
            },
            getOrderLabel() {
                this.$_api.post({
                    'ext': 'my-info/order-commentTag',
                    'shopId': this.shopId,
                    'starLevel': this.starNum,
                    'businessId': this.businessId
                }, true, false, true).then(res => {
                    // this.labelList = res.data;
                    for (var i = 0; i < res.data.length; i++) {
                        if (i < 5) {
                            this.labelList.push(res.data[i]);
                            // this.labelId.push(res.data[i].commentTagId);
                        }

                    }
                }).finally(() => {

                })
            },
            selectLabel(id, index, event) {
                if (event.target.className) {
                    event.target.className = '';
                    this.labelId.splice(index, 1);
                } else {
                    event.target.className = 'labeChose';
                    this.labelId.push(id);
                }

                console.log(this.labelId);
            },
            starComment(n) {
                this.starNum = n;
                this.labelList = [];
                this.labelId = [];
                this.getOrderLabel();
            },
            submitComment() {

                this.$_api.auth()
                    .then(userinfo => {
                        var userInfo = JSON.parse(this.$_cookie.get('userInfo'));
                        this.custId = userInfo.custId;
                        this.verifyData().then(tip => {
                            var arr = [];
                            for (var i = 0; i < this.uploadImg.length; i++) {
                                arr.push(this.uploadImg[i].fileUrl)
                            }
                            Indicator.open();
                            this.$_api.post({
                                'ext': 'my-info/order-comment-save',
                                'orderId': this.orderId,
                                'custId': this.custId,
                                'star': this.starNum,
                                'commentType': this.uploadImg.length > 0 ? 0 : (this.starNum >= 3) ? 1 : (this.starNum <= 1) ? 2 : 3,
                                'isPic': this.uploadImg.length > 0 ? 1 : 0,
                                'content': encodeURIComponent(this.content),
                                'images': arr.join(','),
                                'labels': this.labelId.join(',')
                            }, true, false, true).then(res => {
                                Indicator.close();
                                var state = {
                                    title: "页面跳过替换",
                                    url: location.pathname + "#/history-back-skip"
                                };
                                history.replaceState(state, "", location.pathname + '#/order-list?v=20170728');
                                setTimeout(() => {
                                    if (res.code == 1) {
                                        this.$router.push({ path: `/comment-success/${this.orderId}` });
                                    } else {
                                        this.$_showtip(res.msg, 'error');
                                    }
                                }, 300)

                            }).finally(() => {
                            })
                        }).catch(error => {
                            this.$_showtip(error, 'error');
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    })

            },
            verifyData() {
                return new Promise((resolve, reject) => {
                    if (!this.starNum || this.starNum == '') {
                        reject('您还没为商品打分');
                    }
                    if (!this.content || this.content == '') {
                        reject('请输入评语！');
                    }
                    resolve(true);
                });
            },
            uploadFile(e, data) {
                if (this.uploadImg.length < 9) {
                    var form = new window.FormData();
                    form.append('file', e.target.files[0])
                    this.url = 'http://up-z2.qiniu.com/'
                    form.append('token', this.token);
                    var filesize = e.target.files[0].size / (1024 * 1024);
                    var fileType = e.target.files[0].type.split('/')[0];
                    e.target.value = '';
                    // 上传图片
                    if (fileType.indexOf('image') > -1) {
                        Indicator.open({
                            text: '上传中...',
                            spinnerType: 'fading-circle'
                        });
                        var xhr = new XMLHttpRequest();
                        xhr.open("POST", this.url);
                        xhr.send(form);
                        xhr.onreadystatechange = () => {
                            console.log(xhr.readyState);
                            if (xhr.readyState === 4) {
                                if (xhr.status == 200) {
                                    this.$_showtip('上传成功!')
                                    let res = JSON.parse(xhr.responseText);
                                    this.uploadImg.push({ fileUrl: this.domain + res.key + '?imageMogr2/auto-orient' });
                                    Indicator.close();
                                } else {
                                    this.$_showtip('上传失败,请稍候再试!');
                                    Indicator.close();
                                }
                            }
                        }

                    } else {
                        this.$_showtip('上传失败,请上传图片类型!');
                    }


                } else {
                    e.target.value = '';
                    this.$_showtip('最多可上传9张图片哦！');
                }
            },
            deleteImg(index) {
                MessageBox({
                    message: '您确定删除照片吗？',
                    confirmButtonText: '确定',
                    showCancelButton: true
                }).then(action => {
                    if (action === 'confirm') {
                        this.uploadImg.splice(index, 1);
                    }
                });
            },
            sum() {
                if (this.content.length == 100) {
                    this.$_showtip('最多可输入100个字哦！');
                }
            },

        }
    }

</script>
<style lang="scss" src="./submit-comment.scss" scoped></style>