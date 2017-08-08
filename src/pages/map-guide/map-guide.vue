<template>
    <div class="map-guide-page">
        <header class="smi-header">
            <go-back></go-back>
            <h2>查看地图</h2>
        </header>
        <main>
            <div id="map-wrap" class="map-wrap"></div>
            <div class="adress-info">
                <div class="adress-info-header">
                    <h4>{{currentStoreInfo.name}}</h4>
                </div>
                <div class="adress-detail">
                    {{currentStoreInfo.address}}
                </div>
                <div class="store-distance">
                    距离您:
                    <span>{{currentStoreInfo.distance}}</span>
                </div>
                <div class="action-bar">
            <!-- <button @click="clearCover()">清除覆盖物</button> -->
                    <!-- 微信调用地图  -->
                    <button v-if="$_config.platform==='web_wechat'" class="check-adress-btn" @click="openMap()">
                        查看路线
                    </button>
                    <!-- 普通安卓网页  -->
                    <a v-if="$_config.platform==='web_android'" class="check-adress-btn" :href="`bdapp://map/geocoder?location=${currentStoreInfo.latitude},${currentStoreInfo.longitude}`">查看路线</a>
                    <!-- 普通ios网页  -->
                    <a v-if="$_config.platform==='web_ios'" class="check-adress-btn" :href="`baidumap://map/geocoder?location=${currentStoreInfo.latitude},${currentStoreInfo.longitude}`">查看路线</a>
                    <!-- 星美生活安卓  -->
                    <button v-if="$_config.platform==='smi_android'" class="check-adress-btn" @click="openMapBySmiApp()">
                        查看路线
                    </button>
                    <!-- 星美生活苹果 -->
                    <button v-if="$_config.platform==='smi_ios'" class="check-adress-btn" @click="openMapBySmiApp()">
                        查看路线
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import GoBack from '@/components/GoBack';
import LoadMore from '@/components/LoadMore.vue';

export default {
    name: 'map-guide',
    components: {
        'load-more': LoadMore,
        'go-back': GoBack
    },
    data() {
        return {
            map: null,
            x: 116.424374,
            y: 39.914668,
            business_id: 1,
            product_id: 1,
            myPoint: {
                x: 0,
                y: 0
            },
            endPoint: {
                x: 114.424374,
                y: 23.914668
            },
            storeList: [],
            total: 0,
            currentStoreInfo: {}
        }
    },
    computed: {
        ...mapGetters({
        })
    },
    mounted() {
        this.myPoint.x = parseFloat(this.$_cookie.get('position_x'));
        this.myPoint.y = parseFloat(this.$_cookie.get('position_y'));

        this.endPoint.x = parseFloat(this.$route.params.x);
        this.endPoint.y = parseFloat(this.$route.params.y);

        this.business_id = this.$route.params.businessId;
        this.product_id = this.$route.params.productId;

        this.getStoreInfo();
    },
    methods: {
        getStoreInfo() {
            this.$_api.post({
                ext: 'product/shop-page',
                business_id: this.business_id,
                product_id: this.product_id,
                pageNum: 1,
                pageSize: 100
            }, null, true)
                .then(res => {
                    if (res.code === 1) {
                        this.storeList = res.data.list;
                        this.total = res.data.total;
                        this.initCurrentInfo();
                        this.initMap();
                    }
                })
        },
        initCurrentInfo() {
            var BMap = window['BMap'];
            var point = new BMap.Point(this.endPoint.x, this.endPoint.y);
            var marker = new BMap.Marker(point);
            this.changCurrent(marker);
        },
        initMap() {
            let centerPoint = {
                x: (this.myPoint.x + this.endPoint.x) / 2,
                y: (this.myPoint.y + this.endPoint.y) / 2,
            }
            var BMap = window['BMap'];
            this.map = new BMap.Map("map-wrap");
            // this.map.centerAndZoom(new BMap.Point(centerPoint.x, centerPoint.y), 10);  // 初始化地图,设置中心点坐标和地图级别
            this.map.centerAndZoom(new BMap.Point(this.currentStoreInfo.longitude, this.currentStoreInfo.latitude), 11);  // 初始化地图,设置中心点坐标和地图级别
            this.map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
            this.addStoreCover();
        },
        addStoreCover() {
            var BMap = window['BMap'];
            var myIcon = new BMap.Icon("http://fun.assets.smi170.com/Fs1jQ8RcGvPQEqR2S5q12IKH7Yls?imageMogr2/auto-orient", new BMap.Size(29, 33));
            var myIconActive = new BMap.Icon("http://fun.assets.smi170.com/FgsMK9p01t8fRiyB1N8amnsGn3xZ?imageMogr2/auto-orient", new BMap.Size(29, 33));
            for (var i = 0; i < this.total; i++) {
                var _store = this.storeList[i];
                var point = new BMap.Point(_store.longitude, _store.latitude);
                if (_store.longitude === this.currentStoreInfo.longitude) {
                    var marker = new BMap.Marker(point, { icon: myIconActive });  // 创建标注
                }
                else {
                    var marker = new BMap.Marker(point, { icon: myIcon });  // 创建标注
                }
                this.map.addOverlay(marker);  // 将标注添加到地图中
                this.bindMakerClick(marker);  // 绑定点击事件
            }
        },
        bindMakerClick(marker) {
            var changCurrent = this.changCurrent;
            // var _map = this.map ;
            // var addStoreCover = this.addStoreCover;
            marker.addEventListener("click", function () {
                changCurrent(marker);
            });
        },
        changCurrent(marker) {
            var p = marker.getPosition();       //获取marker的位置
            for (var i = 0; i < this.total; i++) {
                var _store = this.storeList[i];
                if (_store.longitude === p.lng && _store.latitude === p.lat) {
                    this.currentStoreInfo = _store;
                    // this.map.centerAndZoom(new BMap.Point(this.endPoint.x, this.endPoint.y), 8);  // 初始化地图,设置中心点坐标和地图级别
                    break;
                }
            }
            if(this.map){
                this.initMap();
            }
        },
        openMap() {
            this.$_social.mapGuide({
                latitude: this.currentStoreInfo.latitude,
                longitude: this.currentStoreInfo.longitude,
                name: this.currentStoreInfo.name,
                address: this.currentStoreInfo.address,
                scale: 14,
                infoUrl: ''
            })
        },
        openMapBySmiApp(){  // 星美生活ios打开地图
            var _commond = encodeURIComponent(`baidumap://map/direction?origin=latlng:${this.myPoint.x},${this.myPoint.y}|name:我的位置&destination=latlng:${this.currentStoreInfo.latitude},${this.currentStoreInfo.longitude}|name:${this.currentStoreInfo.address}&mode=driving`)
            window.location = 
                `smilife://openBaiduMap?command=${_commond}`
        }
    }
}
</script>
<style lang="scss" src="./map-guide.scss" scoped></style>
