
// 登录
export const userLogin: TApi = (params = {}, options = {}) => {
    const url = '/login';
    return ajax.apiPost(url, params, options);
};

// 退出登录
export const logOut: TApi = (params = {}, options = {}) => {
    const url = '/logout';
    return ajax.apiPost(url, params, options);
};

// 修改密码
export const updatePassword: TApi = (params = {}, options = {}) => {
    const url = '/api/v1/user/pwd';
    return ajax.apiPut(url, params, options);
};

// 获取个人中心用户
export const getUserInfo: TApi = (params = {}, options = {}) => {
    const url = '/api/v1/user/profile';
    return ajax.apiGet(url, params, options);
};

// 告警列表查询
export const queryAlarm: TApi = (params = {}, options = {}) => {
    const url = '/api/v1/iotalarmList';
    return ajax.apiGet(url, params, options);
};

// 电子围栏
export const queryIotfence: TApi = (params = {}, options = {}) => {
    // debugger;
    const url = `/api/v1/iotfenceByImei/${params.equImei}`;
    return ajax.apiGet(url, params, options);
};

// 轨迹回放
export const trajectoryPlayBack: TApi = (params = {}, options = {}) => {
    const url = '/api/v1/iotlocation';
    return ajax.apiGet(url, params, options);
};

// 监控中心
export const queryMonitor: TApi = (params = {}, options = {}) => {
    const url = '/api/v1/iotwcardByGroupId';
    return ajax.apiGet(url, params, options);
};

// 查询工作组
export const queryDept: TApi = (params = {}, options = {}) => {
    const url = '/api/v1/deptTree';
    return ajax.apiGet(url, params, options);
};

