import API from './API'

const api = {
  receiptList: '/order/waybill/selectByPage', // 查询列表
  receiptDetail: '/order/waybill/detail', // 回单详情
  receiptStatus: '/order/waybill/updateStatus', // 修改回单状态
  receiptSend: '/order/receiptMail/addorupd', // 寄出回单
  genMailCode: '/order/receiptMail/genMailCode', // 自动生成交接单号
  getRecut: '/order/receiptMail/getrecut', // 获取统计条数
  uploadReceiptMail: '/order/receiptMail/uploadMail' // 上传回单
}

export default api

/**
 * 获取回单列表
 * params: {
 * }
 *
 * @returns {*}
 */
export function getReceiptList1 (params) {
  return API(api.receiptList, 'post', params)
}
// 回单详情
export function receiptDetail (params) {
  return API(api.receiptDetail, 'post', params)
}
// 修改回单状态
export function changeReceiptStatus (params) {
  return API(api.receiptStatus, 'post', params)
}
// 寄出回单
export function receiptSend (data) {
  return API(api.receiptSend, 'post', {}, data)
}
// 自动生成交接单号
export function genMailCode (params) {
  return API(api.genMailCode, 'get', params)
}
// 获取统计条数
export function getRecut (params) {
  return API(api.getRecut, 'get', params)
}
// 上传回单
export function uploadReceiptMail (params) {
  return API(api.uploadReceiptMail, 'post', params)
}
