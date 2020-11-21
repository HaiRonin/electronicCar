// 第一步
// import axios, {Canceler, AxiosResponse} from 'axios';
// import qs from 'qs';


// 执行中的ajax
const executionAjax: {[key: string]: null | UniApp.RequestTask} = {};

/**
 * 通过请求接口参数 获取对应的请求头 以及请求参数处理函数
 * @param action 一个标志
 */
const action = (action?: string) => {
    let contentType = null;
    let handleRequest = null;
    switch (action) {
        case 'formData':
            contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
            handleRequest = (data: IOBJ) => {
                return data;
            };
            break;
        // case 'formData':
        //     contentType = 'multipart/form-data';
        //     handleRequest = (data: IOBJ) => {
        //         return data;
        //     };
        //     break;
        default:
            contentType = 'application/json;charset=UTF-8';
            handleRequest = (data: IOBJ) => {
                return JSON.stringify(data);
            };
            break;
    }

    return {contentType, handleRequest};
};

/**
 * 初次封装，只处理请求头和参数回调，以及处理是否打断上一次请求
 * @param url 路径
 * @param params 请求参数
 * @param options 其它参数
 */
const get: TMyGet = (url, params, options) => {
    const {method, noCloseBeforeAjax = false, header = {}} = options;
    const {contentType, handleRequest} = action(options.action);

    return new Promise((resolve, reject) => {
        // debugger
        if (!noCloseBeforeAjax && !!executionAjax[url]) {
            executionAjax[url]!.abort();
        }
        executionAjax[url] = null;

        executionAjax[url] = uni.request({
            url,
            method,
            data: params || {},
            timeout: 15000,
            header: Object.assign(header, {
                'Content-Type': contentType,
            }),
            success (res) {
                // debugger;
                const data = res.data as IMyResponse;

                if (data.code === 200) {
                    resolve(data);
                } else {
                    reject({type: 'thenError', data, oldRes: res} as IMyRejectObj);
                }
            },
            fail (error) {
                // debugger;
                if (error && error.errMsg && !!~error.errMsg.indexOf('abort')) {
                    return;
                }
                reject({type: 'catchError', data: error} as IMyRejectObj);
            },
        });
    });
};

export default get;
