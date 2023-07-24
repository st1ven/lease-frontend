/**
 * 默认的全局配置
 */

export default {
    baseURL: '',
    header: {},
    method: 'GET',
    dataType: 'json',
    // #ifndef MP-ALIPAY
    responseType: 'text',
    // #endif
    custom: {},
    // #ifdef H5 || APP-PLUS || MP-ALIPAY || MP-WEIXIN
    timeout: 60000,
    // #endif
    // #ifndef MP-ALIPAY
    sslVerify: true,
    // #endif
    // #ifdef H5
    withCredentials: false,
    // #endif
    // #ifndef MP-ALIPAY
    firstIpv4: false,
    // #endif
    validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300
    }
}
