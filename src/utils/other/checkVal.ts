

export default function (utils: IOBJ) {

    class CheckVal implements ICheckValObj {
        [key: string]: any | TAddRuleFn;

        showTast: boolean = false;
        checkErrArr: TKeyOrErr[] = [];
        emptyKey: TKeyOrErr = {};

        constructor (emptyKey = {}, showTast = true) {
            // super();
            this.emptyKey = emptyKey;
            this.showTast = showTast;
        }

        run (data: IOBJ): boolean {
            const emptyKey = this.emptyKey;
            const arr: TKeyOrErr[] = [];
            // debugger;

            Object.keys(emptyKey).forEach((key) => {
                let text = '';

                if (emptyKey[key] && utils.zEmpty(data[key])) {
                    text = emptyKey[key];
                } else if (typeof this[key] === 'function') {
                    text = this[key](data[key], data);
                }

                text && arr.push({key, text});
            });
            // console.log(arr);

            this.checkErrArr = arr;
            return this.handleInfo(arr);
        }

        handleInfo (arr: IOBJ[]): boolean {
            const text = (arr[0] || {}).text || '';
            this.showTast && text && utils.toast(text);
            return !!text;
        }

        _addRule (key: string, fn: TAddRuleFn): void {
            this[key] = fn;
        }

        bankCard (val: string): string {
            return !/^([1-9]{1})(\d{15}|\d{18})$/.test(val) ? '请输入正确银行卡号' : '';
        }

        phone (val: string): string {
            return !/^1[0-9]{10}$/.test(val) ? '请输入正确手机号' : '';
        }

        idCard (val: string): string {
            return !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(val) ? '请输入正确的身份证号' : '';
        }
    }

    return (emptyKey: IOBJ, showTast?: boolean) => {
        return new CheckVal(emptyKey, showTast);
    };
}

