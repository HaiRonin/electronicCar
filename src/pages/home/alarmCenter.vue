
<template>
    <view class="z-box rel">
        <view style="height:11rpx"></view>

        <view class="top-item flex-box align-center" @tap="timeShow = true">
            <view class="text-1 flex-1">告警时间段</view>
            <view class="text-2">{{params.timeStr}}</view>
            <view class="icon-right"></view>
        </view>
        <!-- <view class="top-item flex-box align-center" @tap="timeShow = true">
            <view class="text-1 flex-1">结束时间</view>
            <view class="text-2">{{params.endTime}}</view>
            <view class="icon-right"></view>
        </view> -->

        <view class="flex-box align-center title">
            <view class="col-1 flex-1">IMEI</view>
            <view class="col-2 flex-1">姓名</view>
            <view class="col-3 flex-1">报警类型</view>
            <view class="col-4 flex-1">报警时间</view>
        </view>

        <!-- <view class="content">
            <view class="flex-box align-center item">
                <view class="col-1 flex-1">IMEIIMEIIMEIIMEIIMEI</view>
                <view class="col-2 flex-1">姓名姓名</view>
                <view class="col-3 flex-1">报警类型</view>
                <view class="col-4 flex-1">2020-01-10 20:20:20</view>
            </view>
        </view> -->

        <view class="content abs">
            <myScrollView ref="myScrollView">
                <template v-slot="{list}">
                    <view v-for="(item, index) in list" :key="index" class="flex-box align-center item">
                        <view class="col-1 flex-1">{{item.equImei}}</view>
                        <view class="col-2 flex-1">{{item.wcardName}}</view>
                        <view class="col-3 flex-1">{{item.equAlarmType}}</view>
                        <view class="col-4 flex-1">{{item.equAlarmTime}}</view>
                    </view>
                </template>
            </myScrollView>
        </view>

        <u-calendar v-model="timeShow" active-bg-color="#299ff7" mode="range" @change="timeChange" class="z-calendar"></u-calendar>
    </view>
</template>

<script lang="ts">
    import {Component, Vue, Ref} from 'vue-property-decorator';
    import {queryAlarm} from '@/apis';
    import myScrollView from '@/components/myScrollView.vue';


    @Component({
        components: {
            myScrollView
        }
    })
    export default class AlarmCenter extends Vue {
        // @Ref('myScrollView') readonly myScrollView!: IOBJ;

        timeShow = false;
        params: IOBJ = {
            beginTime: '',
            endTime: ''
        };


        timeChange (e: IOBJ) {
            this.params.beginTime = e.startDate;
            this.params.endTime = e.endDate;
            this.params.timeStr = `${e.startDate} - ${e.endDate}`;
            this.getList();
        }

        getList () {
            const myScrollView = this.$refs.myScrollView as IOBJ;
            const params = this.params;
            params.beginTime = `${params.beginTime} 00:00:00`;
            params.endTime = `${params.endTime} 23:59:59`;
            myScrollView.getList(1);
        }

        created () {
            const day = this.$store.getters.day;
            this.params.beginTime = day[0];
            this.params.endTime = day[1];
            this.params.timeStr = `${day[0]} - ${day[1]}`;
        }

        mounted () {
            this.$nextTick(() => {
                const myScrollView = this.$refs.myScrollView as IOBJ;
                myScrollView.setDefault({
                    request: queryAlarm,
                    params: this.params
                });
                this.getList();
            });
        }
    }
</script>

<style lang="scss" scoped>
    // @import "uview-ui/index.scss";

    .top-item{
        background: #fff;
        height: 100rpx;
        padding-left: 40rpx;
        font-size: 32rpx;
    }

    .top-item + .top-item{
        border-top:$border-line;
    }

    .text-1{}
    .text-2{}

    .title{
        font-size: 24rpx;
        padding: 32rpx 44rpx 22rpx;
    }

    .title .flex-1{
        // width: 25%;
        // min-width: 25%;
        padding-right: 20rpx;
        text-align: center;
        // max-width: 25%;
    }

    .content{
        margin: 0 22rpx;
        // height: 400rpx;
        left: 0;
        right: 0;
        bottom: 20rpx;
        top: 190rpx;
        box-shadow: 0rpx 8rpx 18rpx 0rpx rgba(0, 0, 0, 0.29);
        border-radius: 12rpx;
        background: #fff;
        overflow: hidden;
    }

    .item{
        font-size: 24rpx;
        padding:20rpx 0;
        margin:0 20rpx;
    }

    .item + .item{
        border-top:$border-line;
    }

    .item .flex-1{
        // width: 25%;
        // min-width: 25%;
        // max-width: 25%;
        padding-right: 20rpx;
        text-align: center;

        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    // .col-1, .col-4{
    //     word-break: break-all;
    //     text-overflow: ellipsis;
    //     display: -webkit-box;
    //     -webkit-line-clamp: 2;
    //     -webkit-box-orient: vertical;
    //     overflow: hidden;
    // }

    .z-calendar {
        font-size: 28rpx;
    }
</style>

