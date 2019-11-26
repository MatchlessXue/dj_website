import API from './API'

const api = {
  openbankDetail: '/customer/invoice/settle/detail', // 查询开票详情
  openbankUpdate: '/customer/invoice/save', // 添加开票信息
  openbankDetele: '/customer/invoice/delete', // 删除开票信息
  addDetail: '/customer/invoice/detail', // 查询添加开票详情
  paymentDetail: '/customer/payment/detail', // 客户结算单出纳详情
  paymentUpdate: '/customer/payment/save' // 添加出纳信息
}

export default api

/**
 * 结算单详情信息
 *
 * @returns {*}
 */
export function openbankDetail (params) {
  return API(api.openbankDetail, 'get', params)
}
// 客户结算单出纳详情
export function paymentDetail (params) {
  return API(api.paymentDetail, 'get', params)
}
// 新增开票信息
export function openbankUpdate (params) {
  return API(api.openbankUpdate, 'post', {}, params)
}
// 新增出纳信息
export function paymentUpdate (params) {
  return API(api.paymentUpdate, 'post', {}, params)
}
// 删除开票信息
export function openbankDetele (params) {
  return API(api.openbankDetele, 'get', params)
}
// 查询添加开票详情
export function addDetail (params) {
  return API(api.addDetail, 'get', params)
}
