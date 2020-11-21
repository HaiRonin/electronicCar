// throttle 的中心思想在于：在某段时间内，不管你触发了多少次回调，我都只认第一次，并在计时结束时给予响应。

export const throttle: TThrottleAndDebounce = (fn, interval = 300) => {
    let time = 0;

    return function (this: any, ...arg: any[]) {
        const now = Date.now();

        if (now - time > interval) {
            time = now;
            fn.apply(this, arg);
        }
    };
};

