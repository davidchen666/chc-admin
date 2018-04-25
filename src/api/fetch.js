import request from '@/utils/request'

//会议列表
export function getEventsList(params) {
  return request({
    url: '?m=events&a=getEventsList',
    method: 'post',
    data: params
  })
}

//管理员列表
export function getAdminList(params) {
  return request({
    url: '?m=admin&a=getAdminList',
    method: 'post',
    data: params
  })
}
//添加管理员
export function addAdmin(params) {
  return request({
    url: '?m=admin&a=addAdmin',
    method: 'post',
    data: params
  })
}
//编辑管理员
export function editAdmin(params) {
  return request({
    url: '?m=admin&a=editAdmin',
    method: 'post',
    data: params
  })
}
//重置管理员密码

export function editAdminPwd(params) {
  return request({
    url: '?m=admin&a=editAdminPwd',
    method: 'post',
    data: params
  })
}
//删除管理员
export function delAdmin(params) {
  return request({
    url: '?m=admin&a=delAdmin',
    method: 'post',
    data: params
  })
}

