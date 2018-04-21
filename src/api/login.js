import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '?m=admin&a=verifyLogin',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '?m=admin&a=getAdminInfo',
    method: 'post',
    data: { token }
  })
}

//此接口需要重新写
export function logout() {
  return request({
    url: '?m=admin&a=getAdminInfo',
    method: 'post'
  })
}
