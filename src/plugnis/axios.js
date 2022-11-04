import axios from 'axios'

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || ''
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

const config = {
// 设置反向代理，前端请求默认发送到 http://localhost:8443/api
	baseURL: "http://127.0.0.1:9000",
   timeout: 60 * 1000, // Timeout
  // withCredentials: true, //检查跨站点访问控制
}

// 创建Axios对象
const Axios = axios.create(config)

// 请求拦截器
Axios.interceptors.request.use(
  config => {
    // Do something before request is sent
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// 响应拦截器
Axios.interceptors.response.use(
  response => {
    // Do something with response data
    return response
  },
  error => {
    // Do something with response error
    return Promise.reject(error)
  }
)

export default {
  install (App) {
    // 挂载axios到Vue对象
    App.config.globalProperties.$axios = Axios
  }
}
