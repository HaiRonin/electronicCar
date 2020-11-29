// 第二步
import CacheAjax from './cacheAjax';
import domain from './domain';
import get from './axiosPack';

// 估计这里同步加载不到 store，所以弄成异步加载，看vue.config.js
let store: IOBJ | null = null;

const cacheData: IOBJ = {};
const ajaxErr = [
    {key: 'fail timeout', text: '请求超时，请稍后...'},
    {key: '404', text: '请求地址有误'},
    {key: 'request:fail', text: '请求发送失败'},
];

// 错误处理
const handleError = (err: IMyRejectObj) => {
    console.log(err);
    const {type, data} = err;
    let errorText = '服务器异常';
    let item = null;
    // console.log(data.msg);
    switch (true) {
        case type === 'catchError':
            item = ajaxErr.find((ii) => ~(data.message || data.errMsg || '').indexOf(ii.key));
            item && (errorText = item.text);
            break;
        case type === 'thenError' && (!!data.resultMsg || !!data.msg):
            errorText = data.resultMsg || data.msg;
            break;
    }

    return errorText;
};

// loading 延迟 处理
const ajax1 = async (url: string, params: IOBJ, options: IMyOptions) => {
    const {isLoad, closeErrorTips, coerceCloseErrorTips} = options;

    if (isLoad) {
        utils.showLoad();
    }

    !utils.zEmpty(options.sleep) && await utils.sleep(options.sleep);

    console.warn('请求', {url, params});

    return get(url, params, options).finally(() => {
        if (isLoad) utils.hideLoad();
    }).then((res) => {
        console.warn('回调', {url, params, res});
        return res;
    }).catch((err) => {
        // console.error(err);
        console.warn('回调报错', {url, params, err});
        if (
            !coerceCloseErrorTips &&
            (!closeErrorTips || err.type === 'catchError')
        ) {
            // 提示
            setTimeout(() => {
                utils.toast(handleError(err));
            }, 0);
        }
        return Promise.reject(err);
    });
};

// 加上缓存功能，还有特殊处理，还有异步加载store
export default async function ajax2 (url: string, params: IOBJ, options: IMyOptions) {
    const {targetDomain} = options;
    const baseUrl = domain[targetDomain!];

    if (!store) {
        store = await import('@/store');
        store = store.default;
    }

    url = baseUrl + url;
    options.header = Object.assign({Authorization: store!.getters.userInfo.token}, options.header || {});

    const cacheKey = url;
    // const cacheKey = `${url}${JSON.stringify(params)}`;
    let cacheObj = cacheData[cacheKey];
    if (!cacheObj) {
        cacheObj = new CacheAjax((params, options) => {
            delete params._URL;
            return ajax1(url, params, options);
        });
    }

    params._URL = url;
    cacheData[cacheKey] = cacheObj;
    return cacheObj.run(params, options);
}
