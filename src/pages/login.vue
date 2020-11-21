<template>
    <view class="">
        <image :src="require('@/assets/image/bg.png')" class="top-bg"/>
        <view class="content rel">
            <image class="logo" :src="require('@/assets/image/logo.png')" mode="widthFix"/>
            <view class="flex-box align-center input-box">
                <image class="icon-img" :src="require('@/assets/image/zh.png')"/>
                <input type="text" placeholder="请输入账号" class="flex-1" v-model="params.username"/>
            </view>
            <view class="flex-box align-center input-box">
                <image class="icon-img" :src="require('@/assets/image/mm.png')"/>
                <input type="text" password placeholder="请输入密码" class="flex-1" v-model="params.password"/>
            </view>

            <button class="btn btn-style-1" @tap="submit">登录</button>
        </view>

        <view class="fixed bottom-text">{{appName}} {{appVersions}}</view>
    </view>
</template>

<script lang="ts">

    import {Component, Vue, Ref} from 'vue-property-decorator';
    import {userLogin, getUserInfo} from '@/apis';
    import {State, Getter} from 'vuex-class';
    // import md5 from 'md5';

    @Component
    export default class Login extends Vue {
        @State('appName') appName!: string;
        @State('appVersions') appVersions!: string;
        @Getter('redirect/getRedirectUrl') getRedirectUrl!: IOBJ;

        params: IOBJ = {};
        check = utils.createdCheckVal({
            username: '请输入账号',
            password: '请输入密码',
        });

        async submit () {
            const data = this.params;
            if (this.check.run(data)) return;
            data.code = 'string';
            data.uuid = 'string';

            try {

                utils.showLoad();
                const res = await userLogin(data);
                // console.log(res);
                res.token = `Bearer ${res.token}`;

                const user = await getUserInfo({}, {header: {Authorization: res.token}});

                this.$store.commit('user/setState', {
                    token: res.token,
                    // user: user.data,
                    ...user.data,
                    other: {
                        dept: user.dept,
                        postIds: user.postIds,
                        posts: user.posts,
                        roleIds: user.roleIds,
                        roles: user.roles,
                    }
                });

                const pageObj = this.getRedirectUrl;
                let {url, index}: IOBJ = {};

                if (pageObj) {
                    ({url, index} = pageObj);
                } else {
                    url = '/pages/home/monitoringCenter';
                    index = 2;
                }

                this.$store.commit('redirect/clearData');
                utils.link(url, index);
            } catch (error) {
                console.error(error);
            }

            utils.hideLoad();
        }

        created () {
            this.submit = utils.throttleD(this.submit);
            // utils.createdCheckVal
        }

    }
</script>

<style lang="scss" scoped>
    // page {
    //     height: 100%;
    //     background: url('~@assets/image/bg.png') no-repeat top left;
    // }

    .top-bg{
        width: 100%;
        height: 640rpx;
    }

    .content{
        background: #fff;
        margin: -310rpx 50rpx 0;
        border-radius: 20rpx;
        padding:58rpx 0 90rpx;
    }

    .logo{
        margin: auto auto 64rpx;
        width: 70%;
    }

    .input-box{
        margin: 32rpx 48rpx;
        padding: 15rpx 10rpx;
        background: #F1F1F1;
        border-radius: 10rpx;
    }

    .icon-img{
        width: 60rpx;
        height: 60rpx;
        margin-right: 11rpx;
    }

    .btn{
        width: auto;
        margin: 74rpx 48rpx 0;
        height: 88rpx;
        border-radius: 40rpx;
    }

    .bottom-text{
        font-size: 24rpx;
        text-align: center;
        color: $grey-color;
        bottom:54rpx;
        left: 0;
        width: 100%;
    }

</style>
