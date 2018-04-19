import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: 'm=index&a=verifyLogin',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: 'm=index&a=getAdminInfo',
    method: 'post',
    data: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
