
// Throttle(节流) 和 Debounce(防抖) 结合
// 主要思路就是，在 长时间不操作或第一次操作 时立马执行，后续的连续操作使用防抖。


export const throttleD: TThrottleAndDebounce = (fn, interval = 300) => {
    let t: any = null;
    let time = 0;

    return function (this: any, ...arg: any[]) {
        const now = Date.now();

        if (now - time > interval) {
            t && clearTimeout(t);

            time = now;
            fn.apply(this, arg);
        } else {
            t && clearTimeout(t);

            t = setTimeout(() => {
                time = now;
                fn.apply(this, arg);
                t = null;
            }, interval);
        }
    };
};

