import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import MD5 from 'md5'
// const devUrlBase = 'https://dev.hjhx.cn/api' // 开发服务器地址
// const proUrlBase = 'https://api.hjhx.cn' // 生产服务器地址
var devUrlBase = 'http://127.0.0.1:7002' //  开发服务器地址
var proUrlBase = 'https://wxmp.hanchunrun.cn' // 生产服务器地址
var urlbase = devUrlBase // 默认请求服务器
function getHeader(url, data) {
    console.log("url", url)
    let datastr = "";
    if (data) {
        var datas = JSON.stringify(data)
        datastr = encodeURIComponent(datas)
    }
    let ts = (new Date()).valueOf()
    let source = "wxmp_xhy"
    let ver = "1.0"
    let sign = Taro.getStorageSync("token") + ts + ver + source + encodeURIComponent(url) + datastr
    let signmd5 = MD5(sign)
    console.log(signmd5)
    return {
        "ts": ts,
        "source": source,
        "ver": ver,
        "Authorization": "Bearer " + Taro.getStorageSync("token"),
        "sign": signmd5
    }
}

// 请求状态处理（返回message,(调用时需要在相应的页面添加iview message组件)）
function statusHandler(status, type = "error") {
    console.log('statusHandler(' + status + ')');
    console.log(status);
    let message = ""
    Taro.hideLoading();
    switch (status) {
        case 0:
            message = '网络问题稍后再试'
            break;
        case "request:fail timeout":
            message = '请求超时稍后再试'
            break;
        case 204:
            message = '没有内容稍后再试'
            break;
        case 400:
            message = '错误的请求参数'
            break;
        case 401:
            message = '没有权限'
            break;
        case 403:
            message = '没有权限'
            break;
        case 404:
            message = '请求地址错误'
            break;
        case 500:
            message = '请稍候再试'
            break;
        case 502:
            message = '请稍后再试'
            break;
        default:
            message = '未知错误'
    }
    Taro.atMessage({
        message,
        type
    })
}

// 异常错误logError日志
const logError = (name, action, info) => {
    if (!info) {
        info = 'empty'
    }
    try {
        let deviceInfo = Taro.getSystemInfoSync() // 这替换成 taro的
        var device = JSON.stringify(deviceInfo)
    } catch (e) {
        console.error('not support getSystemInfoSync api', e.message)
    }
    let time = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
    console.error(time, name, action, info, device)
    // 如果使用了 第三方日志自动上报
    // if (typeof action !== 'object') {
    // fundebug.notify(name, action, info)
    // }
    // fundebug.notifyError(info, { name, action, device, time })
    if (typeof info === 'object') {
        info = JSON.stringify(info)
    }
}

// Taro.request拦截器
const interceptor = function (chain) {
    const requestParams = chain.requestParams
    const { method, data, url } = requestParams
    console.log("requestParams拦截器请求的参数", requestParams)
    console.log(`http ${method || 'GET'} --> ${url} data: `, data)
    return chain.proceed(requestParams)
        .then(res => {
            console.log(`http <-- ${url} result:`, res)
            if (res.statusCode !== 200) {
                return statusHandler(res.statusCode)
            } else {
                console.log("res.data", res.data)
                return res.data
            }
        }).catch(err => {
            logError('api', url, err)
        })
}

Taro.addInterceptor(interceptor)

// get方法
function get(url) {
    if (Taro.getStorageSync('isDev') === "false") {
        urlbase = proUrlBase
    } else {
        urlbase = devUrlBase
    }
    console.log(urlbase)
    var header = getHeader(url);
    url = `${urlbase}${url}`
    return Taro.request({
        method: 'GET',
        url: url,
        dataType: 'json',
        header: header,
        // success(res) {
        //     console.log("res",res)
        //     if (res.statusCode !== 200) {
        //         return statusHandler(res.statusCode)
        //     } else {
        //         console.log("res.data",res.data)
        //         return res.data
        //     }
        // },
        // fail(e) {
        //     logError('api', url, e)
        // }
    })
}

// post方法
function post(url, data) {
    if (Taro.getStorageSync('isDev') == "false") {
        urlbase = proUrlBase
    } else {
        urlbase = devUrlBase
    }
    console.log(urlbase)
    var header = getHeader(url, data);
    url = `${urlbase}${url}`
    return Taro.request({
        method: 'POST',
        url: url,
        data: data,
        dataType: 'json',
        header: header
    })
}

//  put方法
function put(url, data) {
    if (Taro.getStorageSync('isDev') == "false") {
        urlbase = proUrlBase
    } else {
        urlbase = devUrlBase
    }
    console.log(urlbase)
    var header = getHeader(url, data);
    url = `${urlbase}${url}`
    return Taro.request({
        method: 'PUT',
        url: url,
        dataType: 'json',
        data: data,
        header: header
    })
}

//  delete方法
function del(url, data) {
    if (Taro.getStorageSync('isDev') == "false") {
        urlbase = proUrlBase
    } else {
        urlbase = devUrlBase
    }
    console.log(urlbase)
    var header = getHeader(url, data);
    url = `${urlbase}${url}`
    return Taro.request({
        method: 'DELETE',
        url: url,
        dataType: 'json',
        data: data,
        header: header
    })
}

export {
    get,
    post,
    put,
    del
}

