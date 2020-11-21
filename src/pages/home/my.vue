
<template>
    <view>
        <view style="height:11rpx"></view>

        <view v-for="(item, index) in list" :key="index" class="item flex-box align-center" @tap="action(item)">
            <image class="icon" :src="item.icon"/>
            <view class="text-1 flex-1">{{item.text}}</view>
            <view v-if="item.type === 'show'" class="text-2">{{item.value}}</view>
            <view v-else class="icon-right"></view>
        </view>

        <view class="out-login btn" @tap="logOut">退出登录</view>

        <upDataPwa ref="upDataPwa"/>
    </view>
</template>

<script lang="ts">
    import {Component, Vue, Ref} from 'vue-property-decorator';
    import {Getter, Mutation, State} from 'vuex-class';
    import upDataPwa from '@/components/upDataPwa.vue';
    import {logOut} from '@/apis';

    @Component({
        components: {
            upDataPwa
        }
    })
    export default class My extends Vue {
        @State('appVersions') appVersions!: string;
        @Getter('isLogin') readonly isLogin!: boolean;
        @Getter('userInfo') readonly userInfo!: IOBJ;
        @Mutation('user/clearState') readonly clearUserInfo!: () => void;
        // @Ref('upDataPwa') readonly upDataPwa!: IOBJ;

        list: IOBJ[] = [
            {icon: require('@/assets/image/tx.png'), text: '账号', value: '', type: 'show'},
            {icon: require('@/assets/image/xiugai@2x.png'), text: '修改密码', value: 'upDataPwa', type: 'action'},
            {icon: require('@/assets/image/banben@2x.png'), text: '版本号', value: '', type: 'show'},
        ];

        action (item: IOBJ) {
            if (item.type === 'show') return;
            // utils.toast(item.text);
            const com = item.value;
            (this.$refs[com] as IOBJ).openFun();
        }

        async logOut () {
            this.clearUserInfo();
            await logOut({}, {closeErrorTips: true}).catch(() => true);
            utils.link('/pages/login', 2);
        }

        created () {
            // console.log(this.userInfo);
            const list = this.list;
            list[0].value = this.userInfo.username;
            list[2].value = this.appVersions;
        }
    }
</script>

<style lang="scss" scoped>
    .item{
        background: #fff;
        height: 100rpx;
        padding-left: 16rpx;
        font-size: 32rpx;
    }

    .item + .item{
        border-top:$border-line;
    }

    .icon{
        height: 64rpx;
        width: 64rpx;
        margin-right: 19rpx;
    }

    .text-1{}
    .text-2{
        padding-right: 30rpx;
    }

    .icon-right{}

    .out-login{
        background-color: #EC0000;
        width: 100%;
        height: 100rpx;
        color: #fff;
        border-radius: 0;
        border: none;
        margin-top: 80rpx;
        font-size: 32rpx;
    }
</style>

