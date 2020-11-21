

// export default function () {
// }
// 防抖的中心思想在于：我会等你到底。在某段时间内，不管你触发了多少次回调，我都只认最后一次。

export const debounce: TThrottleAndDebounce = (fn, interval = 300) => {
    let t: any = null;

    return function (this: any, ...arg: any[]) {

        t && clearTimeout(t);
        t = setTimeout(() => {
            fn.apply(this, arg);
            t = null;
        }, interval);
    };
};


