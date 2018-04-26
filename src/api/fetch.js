import request from '@/utils/request'

//========================= events =========================
//会议列表
export function getEventsList(params) {
  return request({
    url: '?m=events&a=getEventsList',
    method: 'post',
    data: params
  })
}
//========================= hotel =========================
//酒店列表
export function getHotelList(params) {
  return request({
    url: '?m=hotel&a=getHotelList',
    method: 'post',
    data: params
  })
}
//添加酒店
export function addHotel(params) {
  return request({
    url: '?m=hotel&a=addHotel',
    method: 'post',
    data: params
  })
}
//编辑酒店
export function editHotel(params) {
  return request({
    url: '?m=hotel&a=editHotel',
    method: 'post',
    data: params
  })
}
//更改状态
export function editHotelState(params) {
  return request({
    url: '?m=hotel&a=editHotelState',
    method: 'post',
    data: params
  })
}
//========================= admin =========================

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

