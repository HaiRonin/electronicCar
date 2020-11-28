


let apiServer: IApiServer = {
    baseApi: ''
};
apiServer = globalConfig.DEN_DOMAIN;


// #ifdef MP-WEIXIN
const env = __wxConfig.envVersion;

switch (env) {
    // 线上环境域名';
    case 'release':
        apiServer = globalConfig.BUILD_DOMAIN;
        break;
    // 体验版环境域名';
    case 'trial':
        apiServer = globalConfig.TEST_DOMAIN;
        break;
    // 开发
    case 'develop':
    default:
}
// #endif


// #ifdef H5
if (process.env.NODE_ENV === 'development') {
} else if (process.env.NODE_ENV === 'test') {

    apiServer = globalConfig.TEST_DOMAIN;

} else if (process.env.NODE_ENV === 'production') {

    apiServer = globalConfig.BUILD_DOMAIN;

}
// #endif

globalConfig.domain = apiServer as IApiServer;
export default apiServer as IApiServer;
