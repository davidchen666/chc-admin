import request from '@/utils/request'

export function getList() {
  return request({
    url: '?m=events&a=getEventsList',
    method: 'post',
    data: null
  })
}
