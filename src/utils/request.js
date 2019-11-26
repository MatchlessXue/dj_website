import Vue from 'vue'
import axios from 'axios'
import Message from 'ant-design-vue/es/message'
import {
  ACCESS_TOKEN
} from '@/store/mutation-types'
import store from '@/store/'
import baseURL from '@root/baseurl.config.js'

console.log('baseUrl===', baseURL)

const toType = obj => {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

// create an axios instance
const service = axios.create({
  baseURL, // api 的 base_url
  timeout: 100000 // request timeout
})

service.serviceConfig = {}

// request interceptor
service.interceptors.request.use(
  config => {
    const token = Vue.ls.get(ACCESS_TOKEN)
    // if (token) {
    //   config.headers['Authorization'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
    // }
    service.serviceConfig = config
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    const res = response.data
    if (res.code) { // 自定义code 判断是否出错  code = 0 成功，其它值失败
      if (res.code === 111 || res.code === 107) {
        // 账号密码出错
        store.commit('SET_ACCOUNT_ALERT_SHOW', true)
        store.commit('SET_ACCOUNT_ALERT_MSG', res.message)
      }
      // if (res.code === 600) {
      //   Message.error(
      //     res.message || '',
      //     2
      //   )
      // }
      // Message({
      //   message: res.message,
      //   type: 'error',
      //   duration: 5 * 1000
      // })
      // // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   // 请自行在引入 MessageBox
      //   // import { Message, MessageBox } from 'element-ui'
      //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       location.reload() // 为了重新实例化vue-router对象 避免bug
      //     })
      //   })
      // }

      // hideToast 如果code大于0，是否提示错误信息，默认false：提示错误信息
      const { params = {}, data = {} } = service.serviceConfig
      let dataObj = data
      if (typeof data === 'string') {
        dataObj = JSON.parse(data)
      }
      if (!(params.hideToast || dataObj.hideToast)) {
        Message.error(
          res.message || '系统错误',
          2
        )
      }

      return Promise.reject(res)
    } else {
      // console.log('request', res)
      // console.log('request', res.data)
      // console.log('req', response.data)
      // 针对特殊数据进行处理
      let o = response.data.data
      if (toType(o) === 'object') {
        for (let i in o) {
          if (o[i] === 0 || o[i] === '') {
            delete o[i]
          }
        }
      }
      return response.data
    }
  },
  err => {
    console.log('err' + err) // for debug
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误'
          break

        case 401:
          err.message = '未授权，请重新登录，2 秒后将跳转至登录页面'
          // window.location.reload()
          setTimeout(() => {
            window.top.location.href = '/login/#/login'
          }, 2000)
          break
        case 403:
          err.message = '拒绝访问'
          break

        case 404:
          err.message = `请求地址出错: ${err.response.config.url}`
          break

        case 408:
          err.message = '请求超时'
          break

        case 500:
          err.message = '服务器内部错误'
          break

        case 501:
          err.message = '服务未实现'
          break

        case 502:
          err.message = '网关错误'
          break

        case 503:
          err.message = '服务不可用'
          break

        case 504:
          err.message = '网关超时'
          break

        case 505:
          err.message = 'HTTP版本不受支持'
          break

        default:
      }
    }
    Message.destroy()
    Message.error(
      err.message || '系统错误',
      2
    )
    return Promise.reject(err)
  }
)

export default service
