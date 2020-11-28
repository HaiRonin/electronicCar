
<template>
    <view class="z-box">
        <!-- <image class="top-bg" :src="require('@/assets/image/br01.png')" /> -->
        <map
            class="z-map"
            id="zMap"
            :longitude="mainLonAndLat[1]"
            :latitude="mainLonAndLat[0]"
            :markers="markers"
            :scale="scale"
            :show-location="false"
            @updated="mapLoad = false"
            @markertap="markertap"
            @labeltap="markertap"
        >
            <cover-view v-if="mapLoad" class="map-load flex-box align-center justify-center">地图加载中</cover-view>

            <cover-image v-if="!mapLoad" class="search-img fixed" :src="require('@/assets/image/fangdajing-@2x.png')" @tap="show = true"></cover-image>
        </map>

        <classifySelect v-model="show" :data="deptData" :defaultVal="deptDefaultVal" @change="csChange"/>
    </view>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {queryDept, queryMonitor} from '@/apis';
    import classifySelect from '@/components/classifySelect.vue';
    import transition from '@/assets/js/coordinateSystem';

    // require('@/assets/image/bule@2x.png');

    @Component({
        components: {
            classifySelect
        }
    })
    export default class MonitoringCenter extends Vue {

        mainLonAndLat = ['22.543567787553293', '114.06527985546873'];
        scale = 14;
        mapLoad = true;
        show = false;
        deptData: IOBJ[] = [];
        deptDefaultVal = 0;
        mapContext: IOBJ | null = null;
        markers: IOBJ[] = [];

        markertap (e: IOBJ) {
            const index = e.detail.markerId;
            const item = this.markers[index].item;
            console.log(item);
            utils.link(`/pages/trajectoryPlayBack?equImei=${item.equImei}`);
        }

        getMarker (item: IOBJ, index: number) {
            return {
                id: index,
                item,
                latitude: item.latitude,
                longitude: item.longitude,
                iconPath: require('@/assets/image/bule@2x.png'),
                width: 22,
                height: 28,
                zIndex: 3,
                label: {
                    content: item.wcardName,
                    color: '#ffffff',
                    fontSize: 12,
                    anchorX: 0,
                    anchorY: -56,
                    borderRadius: 10,
                    bgColor: '#949494',
                    textAlign: 'center',
                    padding: 6
                }
            };
        }

        getDeptId (list: IOBJ[]): number {
            const item = list[0];
            // if (!item) return null;

            const newList = item.children;

            if (newList.length <= 0) {
                return item.deptId;
            } else {
                return this.getDeptId(newList);
            }
        }

        getMapData (groupId: number, isLoad = true) {

            // this.mapContext && this.mapContext.removeMarkers({
            //     markerIds: this.markers.map((ii: IOBJ) => ii.id)
            // });
            this.markers = [];

            return queryMonitor({groupId, pageSize: 99, pageIndex: 1}, {isLoad}).then((res) => {
                console.log(res);

                res.data.forEach((item: IOBJ, index: number) => {
                    transition(item as ICS);

                    const newItem = this.getMarker(item, index);
                    this.markers.push(newItem);

                    if (index === 0) {
                        this.mainLonAndLat = [newItem.latitude, newItem.longitude];
                        this.scale = 14;
                        // this.mapContext && this.mapContext.moveToLocation({longitude: newItem.longitude, latitude: newItem.latitude});
                    }
                });

                setTimeout(() => {
                    this.mapContext && this.mapContext.includePoints({
                        points: res.data.map((ii: IOBJ) => ({latitude: ii.latitude, longitude: ii.longitude})),
                        padding: [111, 111, 111, 111]
                    });
                }, 0);
            });
        }

        csChange (deptId: number) {
            setTimeout(() => {
                this.getMapData(deptId);
            }, 0);
        }

        async getData () {
            utils.showLoad();
            try {
                const dept = await queryDept({}, {closeErrorTips: true});
                const deptId = this.getDeptId(dept.data);
                // console.log(deptId, dept.data);

                await this.getMapData(deptId, false);

                this.deptData = dept.data;
                this.deptDefaultVal = deptId;
            } catch (error) {
                console.error(error);
            }
            utils.hideLoad();

        }

        created () {
            this.getData();
        }

        mounted () {
            this.mapContext = wx.createMapContext('zMap');
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

