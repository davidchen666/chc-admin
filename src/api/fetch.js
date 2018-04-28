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
//会议报名列表 
export function getEventsRegisterList(params) {
  return request({
    url: '?m=events&a=getEventsRegisterList',
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

//========================= speaker =========================
//演讲嘉宾列表
export function getSpeakerList(params) {
  return request({
    url: '?m=speaker&a=getSpeakerList',
    method: 'post',
    data: params
  })
}
//添加演讲嘉宾
export function addSpeaker(params) {
  return request({
    url: '?m=speaker&a=addSpeaker',
    method: 'post',
    data: params
  })
}
//编辑演讲嘉宾
export function editSpeaker(params) {
  return request({
    url: '?m=speaker&a=editSpeaker',
    method: 'post',
    data: params
  })
}
//更改状态
export function editSpeakerState(params) {
  return request({
    url: '?m=speaker&a=editSpeakerState',
    method: 'post',
    data: params
  })
}

//========================= media =========================
//媒体列表
export function getMediaList(params) {
  return request({
    url: '?m=media&a=getMediaList',
    method: 'post',
    data: params
  })
}
//添加媒体
export function addMedia(params) {
  return request({
    url: '?m=media&a=addMedia',
    method: 'post',
    data: params
  })
}
//编辑媒体
export function editMedia(params) {
  return request({
    url: '?m=media&a=editMedia',
    method: 'post',
    data: params
  })
}
//更改状态
export function editMediaState(params) {
  return request({
    url: '?m=media&a=editMediaState',
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

