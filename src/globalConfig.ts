
// export const APPID = 'wx731132986c4006ab';

// 测试
export const TEST_DOMAIN = {
    baseApi: 'http://apptest.gdsnkzxyy.cn',
};

// 正式
export const BUILD_DOMAIN = {
    baseApi: 'http://app.gdsnkzxyy.cn',
};

// 首页的几个路径
export const homeUrl = [
    '/pages/home/monitoringCenter',
    '/pages/home/alarmCenter',
    '/pages/home/my',
];

// 进入这几个路径需要刷新
export const refreshUrl = [
];

// 强制登录，白名单
export const whiteList = [
    '/pages/login',
];

// 禁止微信授权的页面
export const banAuth = [];

// 过滤数据用
export const gFilter = (val: string, list: any[], key = 'value') => {
    const item = list.find((ii: IOBJ) => ii[key].toString() === `${val}`);
    return (item && item.text) || '';
};
