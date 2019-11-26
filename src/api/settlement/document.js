import API from './API'

const api = {
  page: '/document/page' // 获取运单结算信息
}

export default api

/**
 * 获取运单结算信息
 */
export function page (params) {
  return API(api.page, 'get', params)
}
