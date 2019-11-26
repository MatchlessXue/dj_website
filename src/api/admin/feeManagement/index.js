import API from './API'
const api = {
  feeList: '/list', // 费用列表
  selectByPage: '/page', // 费用信息列表
  save: '/add', // 新增费用
  update: '/update' // 修改费用
}

export default api

/**
 * 查询列表
 * @param {*} params
 */
export function feeList (params) {
  return API(api.feeList, 'post', params)
}

export function selectByPage (params) {
  return API(api.selectByPage, 'post', {}, params)
}

/**
 * 新增或更新费用信息
 * @param {*} params
 */
export function saveFee (params) {
  return API(api.save, 'post', {}, params)
}
export function updateFee (params) {
  return API(api.update, 'post', {}, params)
}
