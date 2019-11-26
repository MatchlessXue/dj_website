import axios from '@/utils/request'

// 获取客户/承运商/司机账单详情
export function getEntityDocumentDetail () {
  return axios({
    url: '/settle/document/approve/detail',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
