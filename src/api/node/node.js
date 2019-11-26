import API from '../order/API'

const api = {
  list: '/node/list' // 获取所有node信息
}

export default api

/**
 * 查询node列表
 * @param {*} params
 */
export function list (params) {
  return API(api.list, 'get', params)
}
