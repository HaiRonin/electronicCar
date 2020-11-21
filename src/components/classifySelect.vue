<template>
    <u-popup v-model="show" mode="bottom" @close="input(false)">
        <view class="content flex-box">
            <view class="col-item flex-1" v-for="(list, listIndex) in renderData" :key="listIndex">
                <view class="row-title">分类{{listIndex + 1}}</view>
                <view
                    v-for="(item, index) in list"
                    :key="index"
                    @tap="colClick(item, listIndex)"
                    :class="{cur: item.deptId === selData[listIndex].deptId}"
                    class="row-item flex-box align-center justify-s-b"
                >
                    <view class="old-ellipsis">{{item.deptName}}</view>
                    <view class="icon-right" v-if="item.children.length"></view>
                </view>
            </view>
        </view>
        <view class="flex-box align-center justify-s-b btn-group">
            <view class="btn btn-z" @tap="input(false)">取消</view>
            <view class="btn btn-style-1" @tap="change">确定</view>
        </view>
    </u-popup>
</template>

<script lang="ts">

    import {Component, Vue, Model, Emit, Watch, Prop} from 'vue-property-decorator';

    @Component
    export default class ClassifySelect extends Vue {
        @Model('input', {type: Boolean}) readonly value!: boolean;
        @Prop({type: Array}) readonly data!: IOBJ[];
        @Prop({type: Number}) readonly defaultVal!: number;

        show = false;
        renderData: IOBJ[] = [];
        selData: IOBJ[] = [];

        @Emit('input')
        input (e: boolean) {
            return e;
        }

        @Emit('change')
        change () {
            const selData = this.selData;
            const renderData = this.renderData;

            this.input(false);
            return selData.length ? selData[selData.length - 1].deptId : renderData[0].deptId;
        }

        @Watch('value')
        handler (e: boolean) {
            e && this.dataInit();
            this.show = e;
        }

        @Watch('data')
        handlerData (e: IOBJ[]) {
            this.renderData = e.length ? [e] : [];
        }

        dataInit () {
            if (this.selData.length > 0) return;

            const data: IOBJ[] = utils.jsCopyObj(this.data);
            const deptId: number = this.defaultVal || data[0].deptId;
            const cacheParentList: IOBJ = {};
            const renderData: IOBJ[] = [data];

            let selData: IOBJ[] = [];
            let selItem: IOBJ | null = null;


            const fn = (list: IOBJ[], deptId: number, valArr?: IOBJ[]) => {

                list.forEach((item, index) => {
                    // debugger;
                    const vArr: IOBJ[] = valArr ? valArr.slice() : [];

                    const newList = item.children;

                    // item.parentList = vArr.slice();
                    cacheParentList[item.deptId] = vArr.slice();

                    item.deptId === deptId && (selItem = item);

                    if (newList && newList.length > 0) {
                        vArr.push(item);
                        fn(newList, deptId, vArr);
                    }
                });

            };

            fn(data, deptId);
            // console.log(cacheParentList);

            if (selItem) {
                const cache = cacheParentList[selItem!.deptId].slice();
                cache.push(selItem);

                cache.forEach((item: IOBJ, index: number) => {
                    const val = renderData[index].find((ii: IOBJ) => ii.deptId === item.deptId);
                    if (val && val.children && val.children.length) {
                        renderData.push(val.children);
                    }
                });

                selData = cache;
            }

            this.selData = selData;
            this.renderData = renderData;
        }

        colClick (item: IOBJ, listIndex: number) {
            // debugger;
            const renderData = this.renderData.slice(0, listIndex + 1);
            const selData = this.selData.slice(0, listIndex);
            const newList = item.children;

            if (newList.length) {
                renderData.push(newList);
            }

            selData.push(item);
            this.selData = selData;
            this.renderData = renderData;
        }


        created () {}

        mounted () {}

        activated () {}

    }
</script>

<style lang="scss" scoped>
    .content {
        height: 60vh;
        overflow: hidden;
    }

    .col-item {
        // width: 25%;
        height: 100%;
        overflow: auto;
    }

    .col-item + .col-item {
        border-left: $border-line;
    }

    .row-title {
        font-size: 24rpx;
        background: #eee;
        // text-align: center;
        padding: 10rpx 20rpx;
        position: sticky;
        top: 0;
        left: 0;
    }

    .row-item {
        padding: 30rpx 24rpx;
    }

    .row-item + .row-item {
        border-top: $border-line;
    }

    .icon-right {
        width: 40rpx;
        height: 40rpx;
    }

    .cur{
        color: $change-color1;
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
