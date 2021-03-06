/**
 * vue.config.js 全局引入
 */

import checkValFun from './other/checkVal';
export {renderList} from './optimize/renderList';
export {throttle} from './optimize/throttle';
export {debounce} from './optimize/debounce';
export {throttleD} from './optimize/throttleD';

export const jsCopyObj: TJsCopyObj = (data: any, cache = []) => {
    // debugger
    if (data === null || typeof data !== 'object') {
        return data;
    }

    // 循环引用
    const find = cache.find((i) => i.old === data);
    if (find) {
        return find.obj;
    }

    const obj: any = Array.isArray(data) ? [] : {};

    cache.push({
        obj,
        old: data
    });

    Object.keys(data).forEach((key: string) => {
        obj[key] = jsCopyObj(data[key], cache);
    });

    return obj;
};

export const toast: TToast = (() => {
    let t: number | null = null;

    return ((message, duration = 2000, forbidClick = false) => {
        return new Promise((rel, rej) => {
            uni.showToast({
                title: message,
                duration,
                mask: forbidClick,
                position: 'center',
                icon: 'none',
                success: () => {
                    if (t) {
                        clearTimeout(t);
                        t = null;
                    }
                    t = setTimeout(() => {
                        rel();
                    }, duration);
                },
                fail: rej
            });
        });
    }) as TToast;
})();

export const showLoad: TShowToast = (message = '请求中', forbidClick = true) => {
    return uni.showLoading({
        title: message,
        mask: forbidClick
    }) as unknown as Promise<void>;
};

export const hideLoad: THideLoad = () => {
    uni.hideLoading();
};

export const serialize: ISerialize = (data) => {
    const arr = [];
    for (const i in data) {
        const str = data[i];
        // item && (item = `${item}`.replace(/ /g, '%20'));
        arr.push(`${i}=${str || ''}`);
    }
    return arr.join('&');
};

export const dateData: TDateData = (() => {
    const WEEK_ARR = ['日', '一', '二', '三', '四', '五', '六'];

    const addZero = (val: number) => {
        return `${val}`.padStart(2, '0');
    };

    return (date: Date, format = 'y-m-d') => {
        const o: IDateData = {
            y: date.getFullYear(),
            m: addZero(date.getMonth() + 1),
            d: addZero(date.getDate()),
            h: addZero(date.getHours()),
            mm: addZero(date.getMinutes()),
            s: addZero(date.getSeconds()),
            time: date.getTime(),
            week: WEEK_ARR[date.getDay()],
            weekend: [0, 6].includes(date.getDay()),
            text: '',
            textTime: '',
        };

        const text = format.replace(/[ymd]/g, (str) => {
            return o[str || ''];
        });
        o.text = text;

        const textTime = `${format} h:M:s`.replace(/[ymdhMs]/g, (str) => {
            str === 'M' && (str = 'mm');
            return o[str || ''];
        });
        o.textTime = textTime;

        return o;
    };
})();

export const toFixed: TToFixed = (val, toNum = false, retain = 2) => {
    const newVal = (+val).toFixed(retain);
    return toNum ? +newVal : newVal;
};

export const link: TLink = (() => {
    const linkMethods: TLinkMethods[] = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab', 'navigateBack'];
    const linkFlag = false;
    const refreshUrl = globalConfig.refreshUrl;

    return function (objOrStr, index = 0) {
        // if (linkFlag) {
        //     return Promise.resolve();
        // }
        // linkFlag = true;
        // setTimeout(() => {
        //     linkFlag = false;
        // }, 200);

        let [_url, _delta, _index]: [string | number | undefined, number | undefined, number | undefined] = [undefined, undefined, undefined];

        if (typeof objOrStr === 'string') {
            _url = objOrStr;
            _index = index;
        } else if (typeof objOrStr === 'number') {
            _delta = objOrStr;
            _index = 4;
        }

        // if (_index === 4) {
        //     linkFlag = false;
        // }

        const key = linkMethods[_index || 0];
        const linkFn = uni[key];
        return new Promise((rel, rej) => {
            linkFn({
                url: _url,
                delta: _delta,
                success () {
                    rel();

                    // #ifdef H5
                    if (zEmpty(_url)) return;
                    let u = _url as string;
                    u = u.substr(0, u.indexOf('?'));
                    const r = refreshUrl.find(str => ~u.indexOf(str));
                    r && window.location.reload();
                    // #endif
                },
                fail (err: IOBJ) {
                    console.error('````````````跳转出错`````````````');
                    console.error(err);
                    console.error(_url, _delta);
                    rej(err);
                    // wx.reLaunch({url: '/pages/index/index'});
                }
            } as any);
        });
    } as TLink;
})();

export const sleep: TSleep = (duration = 500) => {
    if (!duration) return Promise.resolve();
    return new Promise((rel) => {
        setTimeout(() => {
            rel();
        }, duration);
    });
};

export const pullDown: TPullDown = async (fn) => {
    try {
        await fn();
    } catch (error) {
    }
    uni.stopPullDownRefresh();
};

export const setPageTitle: TSetPageTitle = (title) => {
    uni.setNavigationBarTitle({
        title
    });
};

export const zEmpty: TZEmpty = (str) => {
    if (typeof str === 'undefined' || (str + '') === 'null') {
        return true;
    } else if (!`${str}`) {
        return true;
    }
    return false;
};

export const getStorage: TGetStorage = (key) => {
    return uni.getStorageSync(key);
};

export const setStorage: TSetStorage = (key, val) => {
    return uni.setStorageSync(key, val);
};

export const removeStorage: TRemoveStorage = (key) => {
    return uni.removeStorageSync(key);
};

export const clearStorage: TClearStorage = () => {
    return uni.clearStorageSync();
};

export const confirm: TConfirm = ({content = '', title = '提示', cancelText = '取消', confirmText = '确认', showCancel = true} = {}) => {
    return new Promise((rel, rej) => {
        uni.showModal({
            content,
            title,
            cancelText,
            confirmText,
            showCancel,
            success (res) {
                res.confirm ? rel(res.confirm) : rej(res.cancel);
            }
        });
    });

};

export const getBirthdayFromIdCard: IGetBirthdayFromIdCard = (idCard: string) => {
    var birthday = '';
    if (idCard.length === 15) {
        birthday = '19' + idCard.substr(6, 6);
    } else if (idCard.length === 18) {
        birthday = idCard.substr(6, 8);
    }

    birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-');

    return birthday;
};

export const getSexIdCard: IGetSexIdCard = (idCard: string) => {
    var sex = 0;
    if (idCard.length === 15) {
        sex = +idCard.charAt(14);
    } else if (idCard.length === 18) {
        sex = +idCard.charAt(16);
    }

    return sex % 2 === 0 ? '女' : '男';
};

export const getAgeIdCard: IGetAgeIdCard = (idCard: string) => {
    var len = (idCard + '').length;
    if (len === 0) {
        return 0;
    } else {
        // 身份证号码只能为15位或18位其它不合法
        if ((len !== 15) && (len !== 18)) {
            return 0;
        }
    }
    var strBirthday = '';
    // 处理18位的身份证号码从号码中得到生日和性别代码
    if (len === 18) {
        strBirthday = idCard.substr(6, 4) + '/' + idCard.substr(10, 2) + '/' + idCard.substr(12, 2);
    }

    if (len === 15) {
        strBirthday = '19' + idCard.substr(6, 2) + '/' + idCard.substr(8, 2) + '/' + idCard.substr(10, 2);
    }

    // 时间字符串里，必须是“/”
    var birthDate = new Date(strBirthday);
    var nowDateTime = new Date();
    var age = nowDateTime.getFullYear() - birthDate.getFullYear();

    // 再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() === birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

export const createdCheckVal: TCheckValFun = checkValFun({toast, zEmpty});
