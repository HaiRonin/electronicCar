
import store from '@/store';

const {homeUrl, whiteList} = globalConfig;

const getCurUrl = () => {
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    return page;
};

// 处理跳转逻辑
const handle = utils.throttle(() => {
    const page: IOBJ = getCurUrl();
    const {route, options} = page;
    const url = '/pages/login';
    let isSwitchTab = false;
    // 重定向
    const index = 1;

    // console.log(page);
    // console.log(page.route);
    // console.log(page.options);

    if (whiteList.some((url) => !!~url.indexOf(route))) return;

    if (homeUrl.some((url) => !!~url.indexOf(route))) {
        // index = 0;
        isSwitchTab = true;
    }
    // debugger;
    store.commit('redirect/setData', {
        beforeUrl: route,
        isSwitchTab,
        options: utils.jsCopyObj(options)
    });

    utils.link(url, index);
}, 400);

export default function () {
    if (store.getters.isLogin) return;
    handle();
}
