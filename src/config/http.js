import axios from "axios";
import {Loading, Message} from 'element-ui'

let loadingStatus = null;
axios.interceptors.request.use(function(config) { //配置发送请求的信息
    // 下面dispatch报错：sub is not a function
    loadingStatus = Loading.service({fullscreen: true});
    return config;
}, function(error) {
    !!loadingStatus && loadingStatus.close()
    Message.error({
      message: '加载超时'
    })
    return Promise.reject(error);
});

axios.interceptors.response.use(function(data) { //配置请求回来的信息
    !!loadingStatus && loadingStatus.close()
    if (data.status === 401) {
      setTimeout(function () {
        window.location.href = "login"
      }, 2000);
    }
    return data;
}, function(error) {
    !!loadingStatus && loadingStatus.close()
    return Promise.reject(error);
});
axios.defaults.timeout = 4000;
axios.defaults.baseURL = 'http://localhost:3333/';
// 去你妈的改变默认值
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers.Authorization = localStorage.getItem('token');

export default axios
