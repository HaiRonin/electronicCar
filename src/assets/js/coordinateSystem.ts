
/**
 * 坐标系转换
 * 腾讯地图使用的坐标系 gcj02
 *
 * 参考地址 https://www.jianshu.com/p/c39a2c72dc65?from=singlemessage
 */

const pi = 3.1415926535897932384626;
const a = 6378245.0;
const ee = 0.00669342162296594323;
const x_pi = 3.14159265358979324 * 3000.0 / 180.0;

const transformLat = (x: number, y: number) => {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(y * pi) + 40.0 * Math.sin(y / 3.0 * pi)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(y / 12.0 * pi) + 320 * Math.sin(y * pi / 30.0)) * 2.0 / 3.0;
    return ret;
};

const transformLon = (x: number, y: number) => {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += (20.0 * Math.sin(6.0 * x * pi) + 20.0 * Math.sin(2.0 * x * pi)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(x * pi) + 40.0 * Math.sin(x / 3.0 * pi)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(x / 12.0 * pi) + 300.0 * Math.sin(x / 30.0 * pi)) * 2.0 / 3.0;
    return ret;
};

// 84 to 火星坐标系
const wgs84ToGcj02 = (lat: number, lon: number) => {
    let dLat = transformLat(lon - 105.0, lat - 35.0);
    let dLon = transformLon(lon - 105.0, lat - 35.0);
    const radLat = lat / 180.0 * pi;
    let magic = Math.sin(radLat);
    magic = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((a * (1 - ee)) / (magic * sqrtMagic) * pi);
    dLon = (dLon * 180.0) / (a / sqrtMagic * Math.cos(radLat) * pi);
    const mgLat = lat + dLat;
    const mgLon = lon + dLon;
    return {mgLat, mgLon};
};

// BD-09 坐标转换成GCJ-02 坐标
const bd09ToGcj02 = (lat: number, lon: number) => {
    const x = lon - 0.0065, y = lat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
    const ggGon = z * Math.cos(theta);
    const ggGat = z * Math.sin(theta);
    return {mgLat: ggGat, mgLon: ggGon};
};


export default function (item: ICS) {
    // console.log(utils.jsCopyObj(item));
    const {locationType, latitude, longitude} = item;

    let obj = {mgLat: latitude, mgLon: longitude};

    switch (true) {
        case ['WGS84'].includes(locationType):
            obj = wgs84ToGcj02(+latitude, +longitude);
            break;
        case ['BD09', 'GPS', 'WIFI'].includes(locationType):
            obj = bd09ToGcj02(+latitude, +longitude);
            break;
        default:
            break;
    }

    item.latitude = obj.mgLat;
    item.longitude = obj.mgLon;
}


