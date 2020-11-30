import Vue from 'vue';
import App from './App.vue';
import store from './store/index';
import uView from 'uview-ui';
import forcedToLogin from '@/assets/js/forcedToLogin';


Vue.config.productionTip = false;

Vue.use(uView as any);
Vue.prototype.$store = store;

Vue.mixin({
    onLoad (options: IOBJ) {
        for (const key in options) {
            typeof options[key] === 'number' && (options[key] = `${options[key]}`);
        }
        // console.log(store.getters.isLogin);
        store.dispatch('time/ajaxGetTime');
        forcedToLogin();
    },
    onShow () {
    },
    onShareAppMessage () {
        return {};
    }
});

const globalData: IOBJ = {};

new App({
    store,
    globalData
}).$mount();

if (process.env.NODE_ENV === 'development') {
    globalData.globalConfig = globalConfig;
    globalData.utils = utils;
    globalData.ajax = ajax;
    globalData.store = store;
}
