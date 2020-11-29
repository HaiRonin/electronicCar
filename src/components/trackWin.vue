<template>
    <view>
        <u-popup v-model="show" mode="bottom">
            <view>
                <view class="flex-box justify-s-b align-center item">
                    <view class="text-1">equImei</view>
                    <view class="text-2">{{item.equImei}}</view>
                </view>
                <view class="flex-box justify-s-b align-center item">
                    <view class="text-1">名字</view>
                    <view class="text-2">{{item.wcardName}}</view>
                </view>
                <view class="flex-box justify-s-b align-center item">
                    <view class="text-1">状态</view>
                    <view class="text-2">{{item.equOnline === 2 ? '离线' : '在线'}}</view>
                </view>
                <view class="flex-box justify-s-b align-center item" @tap="timeShow = true">
                    <view class="text-1">时间段</view>
                    <view class="text-2">{{params.timeStr}}</view>
                </view>
            </view>
            <view class="flex-box align-center justify-s-b btn-group">
                <view class="btn btn-z" @tap="show = false">取消</view>
                <view class="btn btn-style-1" @tap="link">轨迹回放</view>
            </view>
        </u-popup>
        <u-calendar v-model="timeShow" active-bg-color="#299ff7" mode="range" @change="timeChange" class="z-calendar"></u-calendar>
    </view>
</template>

<script lang="ts">

    import {Component, Vue, Prop} from 'vue-property-decorator';

    @Component
    export default class TrackWin extends Vue {
        // @Prop({required: true, type: Object}) readonly item!: IOBJ;

        show = false;
        timeShow = false;
        params: IOBJ = {};
        item: IOBJ = {};

        openFun (item: IOBJ) {
            const day = this.$store.getters.day;
            this.item = item;
            this.params = {
                equImei: item.equImei,
                beginTime: day[0],
                endTime: day[1],
                timeStr: `${day[0]} - ${day[1]}`
            };
            this.show = true;
        }

        link () {
            const data = utils.jsCopyObj(this.params);
            delete data.timeStr;
            utils.link(`/pages/trajectoryPlayBack?${utils.serialize(data)}`);
            this.show = false;
        }

        timeChange (e: IOBJ) {
            this.params.beginTime = e.startDate;
            this.params.endTime = e.endDate;
            this.params.timeStr = `${e.startDate} - ${e.endDate}`;
        }

        created () {}

        mounted () {}

        activated () {}

    }
</script>

<style lang="scss" scoped>
    .item{
        height: 90rpx;
        padding: 0 34rpx
    }

    .item + .item{
        border-top: $border-line;
    }

    .btn-group{
        border-top: $border-line;
        padding: 18rpx 34rpx;
        box-shadow: 0rpx 2rpx 0rpx 0rpx #D7D7D7;
    }

    .btn{
        border-radius: 26rpx;
    }

    .btn-z{
        background: #D0D0D0;
        color: #fff;
        border:none;
    }
</style>
