
<template>
    <view class="z-box">
        <!-- <image class="top-bg" :src="require('@/assets/image/br01.png')" /> -->
        <map
            id="zMap"
            class="z-map"
            :longitude="createLat[1]"
            :latitude="createLat[0]"
            :markers="markers"
            :polyline="polyline"
            :polygons="polygons"
            :scale="scale"
            :show-location="false"
            @updated="mapLoad = false"
        >
            <cover-view v-if="mapLoad" class="map-load flex-box align-center justify-center">地图加载中</cover-view>

            <cover-image v-if="!mapLoad" class="search-img fixed" :src="require('@/assets/image/fangdajing-@2x.png')" @tap="timeShow = true"></cover-image>
        </map>

        <u-calendar v-model="timeShow" active-bg-color="#299ff7" mode="range" @change="timeChange" class="z-calendar"></u-calendar>
    </view>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {trajectoryPlayBack, queryIotfence} from '@/apis';
    import transition from '@/assets/js/coordinateSystem';

    @Component
    export default class TrajectoryPlayBack extends Vue {

        createLat = ['39.90852813575859', '116.42781247113035'];
        scale = 14;
        mapLoad = true;
        timeShow = false;
        mapContext: IOBJ | null = null;
        params: IOBJ = {};
        markers: IOBJ[] = [];
        polyline: IOBJ[] = [];
        polygons: IOBJ[] = [];

        getMarker (item: IOBJ, index = 0) {
            const imgArr = [
                require('@/assets/image/c.png'), // 当前位置
                require('@/assets/image/q.png'), // 起点
                require('@/assets/image/z.png'), // 终点
            ];

            const label = {
                content: item.wcardName || '移动坐标',
                color: '#ffffff',
                fontSize: 12,
                anchorX: 0,
                anchorY: -56,
                borderRadius: 10,
                bgColor: '#949494',
                textAlign: 'center',
                padding: 6
            };

            return {
                id: index,
                item,
                latitude: item.latitude,
                longitude: item.longitude,
                iconPath: imgArr[index],
                width: 22,
                height: 28,
                // label: index === 0 ? label : undefined
            };
        }

        timeChange (e: IOBJ) {
            this.params.beginTime = e.startDate;
            this.params.endTime = e.endDate;
            this.getTrajectory(true);
        }

        async getTrajectory (isLoad = false) {
            const markers: IOBJ[] = [];
            const data = this.params;
            data.beginTime = `${data.beginTime} 00:00:00`;
            data.endTime = `${data.endTime} 23:59:59`;
            // data.equImei = '867567046597845';

            const res = await trajectoryPlayBack(data, {isLoad});

            const mapPath = res.data;
            const lastIndex = mapPath.length - 1;
            const list = mapPath.map((item: IOBJ, index: number) => {
                const obj = {
                    latitude: item.latitude,
                    longitude: item.longitude,
                    locationType: item.locationType
                };

                transition(obj);

                if (index === 0) {
                    markers.push(this.getMarker(obj, 0));
                    markers.push(this.getMarker(obj, 1));
                } else if (index === lastIndex) {
                    markers.push(this.getMarker(obj, 2));
                }

                return obj;
            });

            this.markers = markers;
            setTimeout(() => {
                // this.scale = 14;
                // list.length && (this.createLat = [list[0].latitude, list[0].longitude]);
                this.polyline = [{
                    points: list,
                    color: '#D70000',
                    width: 4
                }];
                // list.length && this.mapContext!.moveToLocation({longitude: list[0].longitude, latitude: list[0].latitude});
                list.length && this.mapContext!.includePoints({
                    points: list,
                    padding: [50, 50, 50, 50],
                });
            }, 0);
            list.length && setTimeout(() => {
                this.mapContext!.moveAlong({
                    markerId: 0,
                    path: list,
                    duration: 3000,
                    autoRotate: false
                });
            }, 100);
        }

        async getData () {
            utils.showLoad();
            const data = this.params;
            // console.log(utils.jsCopyObj(data));
            // debugger;
            try {
                // await this.getTrajectory();

                const res = await queryIotfence(data);
                if (!res.data.length) return;

                const {Vertexes = '[]', locationType = 'BD09'} = res.data.find((ii: IOBJ) => !!ii.Vertexes) || {};
                const list = JSON.parse(Vertexes).map((item: IOBJ) => {
                    const obj = {
                        latitude: item.lat,
                        longitude: item.lon,
                        locationType
                    };

                    transition(obj);

                    return obj;
                });

                // console.log(list);

                list.length && (this.polygons = [{
                    points: list,
                    // points: [
                    //     {latitude: '39.90852813575859', longitude: '116.42781247113035'},
                    //     {latitude: '39.90691508288556', longitude: '116.43068779919432'},
                    //     {latitude: '39.90754055687543', longitude: '116.43600930187986'},
                    // ],
                    strokeColor: '#f1d0d070',
                    fillColor: '#f1d0d070',
                    strokeWidth: 0,
                    zIndex: 0
                }]);

                setTimeout(() => {
                    // console.log(this.mapContext);
                    if (list.length) {
                        this.mapContext!.includePoints({
                            points: list,
                            padding: [50, 50, 50, 50],
                            success () {
                                utils.hideLoad();
                            }
                        });
                    } else {
                        utils.hideLoad();
                        utils.toast('没有设置范围');
                    }
                }, 0);

                this.getTrajectory(true);
            } catch (error) {
                utils.hideLoad();
            }

        }


        onLoad (options: IOBJ) {
            const day = this.$store.getters.day;
            const params = this.params;
            // console.log(options);
            params.equImei = options.equImei;

            if (options.beginTime && options.endTime) {
                params.beginTime = options.beginTime;
                params.endTime = options.endTime;
            } else {
                params.beginTime = day[0];
                params.endTime = day[1];
            }
        }

        onShow () {
            utils.showLoad();
            // this.$nextTick(() => {
            //     this.mapContext = wx.createMapContext('zMap');
            //     this.getData();
            // });
            setTimeout(() => {
                this.mapContext = wx.createMapContext('zMap');
                this.getData();
            }, 2000);
        }
    }
</script>

<style lang="scss" scoped>
    .z-map {
        width: 100%;
        height: 100%;
    }

    .map-load{
        height: 100%;
        color: $change-color1;
    }

    .search-img{
        height: 93rpx;
        width: 93rpx;
        bottom: 54rpx;
        left: 39rpx;
    }
</style>

