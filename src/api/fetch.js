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
//添加会议
export function addEvents(params) {
  return request({
    url: '?m=events&a=addEvents',
    method: 'post',
    data: params
  })
}
//编辑会议
export function editEvents(params) {
  return request({
    url: '?m=events&a=editEvents',
    method: 'post',
    data: params
  })
}
//获取会议详情
export function getEventsInfo(params) {
  return request({
    url: '?m=events&a=getEventsInfo',
    method: 'post',
    data: params
  })
}
//编辑会议
export function editEventsInfo(params) {
  return request({
    url: '?m=events&a=editEventsInfo',
    method: 'post',
    data: params
  })
}
//会议菜单列表
export function getEventsMenuList(params) {
  return request({
    url: '?m=events&a=getEventsMenuList',
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
//更改会议报名信息-> 报名费用，发票状态，付费渠道，备注信息 
export function editEventsRegister(params) {
  return request({
    url: '?m=events&a=editEventsRegister',
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

//========================= road show =========================
//路演列表
export function getRoadShowList(params) {
  return request({
    url: '?m=roadShow&a=getRoadShowList',
    method: 'post',
    data: params
  })
}
//添加路演
export function addRoadShow(params) {
  return request({
    url: '?m=roadShow&a=addRoadShow',
    method: 'post',
    data: params
  })
}
//编辑路演
export function editRoadShow(params) {
  return request({
    url: '?m=roadShow&a=editRoadShow',
    method: 'post',
    data: params
  })
}
//更改状态
export function editRoadShowState(params) {
  return request({
    url: '?m=roadShow&a=editRoadShowState',
    method: 'post',
    data: params
  })
}

//路演列表
export function getRoadShowRegisterList(params) {
  return request({
    url: '?m=roadShow&a=getRoadShowRegisterList',
    method: 'post',
    data: params
  })
}

//========================= news =========================
//新闻列表
export function getNewsList(params) {
  return request({
    url: '?m=news&a=getNewsList',
    method: 'post',
    data: params
  })
}
//添加新闻
export function addNews(params) {
  return request({
    url: '?m=news&a=addNews',
    method: 'post',
    data: params
  })
}
//编辑新闻
export function editNews(params) {
  return request({
    url: '?m=news&a=editNews',
    method: 'post',
    data: params
  })
}
//更改状态
export function editNewsState(params) {
  return request({
    url: '?m=news&a=editNewsState',
    method: 'post',
    data: params
  })
}

//======================== alliance ===========================
//产业联盟报名申请表
export function getAllianceRegisterList(params) {
  return request({
    url: '?m=alliance&a=getAllianceRegisterList',
    method: 'post',
    data: params
  })
}

//======================== banking ===========================
//精准投行报名表
export function getBankingRegisterList(params) {
  return request({
    url: '?m=banking&a=getBankingRegisterList',
    method: 'post',
    data: params
  })
}

//======================== Page ===========================
//关于我们/咨询服务page
export function getPage(params) {
  return request({
    url: '?m=about&a=getPage',
    method: 'post',
    data: params
  })
}
//编辑 关于我们/咨询服务page
export function editPage(params) {
  return request({
    url: '?m=about&a=editPage',
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

