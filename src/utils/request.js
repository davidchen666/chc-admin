import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  // baseURL: '/api/', // api的base_url 本地调试
  // baseURL: 'http://localhost/chc-api/index.php', // api的base_url 正式环境
  // baseURL: 'http://www.dxx-tech.top/chc-api/', // api的base_url 正式环境
  // baseURL: '../chc-api/', // api的base_url 正式环境
  timeout: 25000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

//respone拦截器
service.interceptors.response.use(
  response => {
    let res;
    // IE9时response.data是undefined，因此需要使用response.request.responseText(Stringify后的字符串)
    if (response.data == undefined) {
      res = response.request.responseText
    } else {
      res = response.data
    }
    // 判断data不是Object时，解析成Object
    if (!(res instanceof Object)) {
      res = eval('(' + res + ')');
    }
  /**
  * code为非20000是抛错 可结合自己业务进行修改
  */
    // console.log(res);
    if (res.resCode !== 200 ) {
      Message({
        message: res.resData,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
      // if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
      //   MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
      //     confirmButtonText: '重新登录',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
      //     store.dispatch('FedLogOut').then(() => {
      //       location.reload()// 为了重新实例化vue-router对象 避免bug
      //     })
      //   })
      // }
      // return Promise.reject('error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
