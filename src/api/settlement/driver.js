import API from './API'

const api = {
  // 费用盘点
  getCostCheckList: '/settle/driver/summary/page', // 费用盘点列表
  costType: '/carrier/balance/settle/cost/list', // 费用类型

  // 结算单
  getSettleList: '/driver/balance/settle/page', // 结算单列表
  waybillPageWithFee: '/driver/balance/page', // 添加结算单list
  addWaybillList: '/driver/balance/update/settle', // 结算单调整添加
  deleteSettle: '/driver/balance/delete', // 删除结算单
  commitSettle: '/driver/balance/commit', // 提交结算单
  addSettlement: '/driver/balance/save', // 新增客户结算单
  updataSettlement: '/driver/balance/update', // 更新协同结算单
  // 结算协同
  reqCoordinateList: '/driver/balance/online/page', // 协同结算单列表
  updateCoordinateList: '/driver/balance/online/status', // 更新协同list状态
  checkCoordinateDetail: '/driver/balance/detail', // 结账单详情
  adjustDocument: '/driver/balance/adjust/document', // 结算单调差

  // 开票信息
  openbankDetail: '/driver/invoice/settle/detail', // 查询开票详情
  openbankUpdate: '/driver/invoice/save', // 添加开票信息
  openbankDetele: '/driver/invoice/delete', // 删除开票信息
  addDetail: '/driver/invoice/detail', // 查询添加开票详情
  paymentDetail: '/driver/payment/detail', // 客户结算单出纳详情
  paymentUpdate: '/driver/payment/save', // 添加出纳信息

  // 出纳
  returnSettlement: '/driver/payment/return/settle', // 退回结算单
  enterSettlement: '/driver/payment/confirm', // 确认结算单
  delSettlement: '/driver/balance/payment/delete'// 删除出纳结算单

}

export default api

/**
 * 费用盘点列表
 */
export function getCostCheckList (params) {
  return API(api.getCostCheckList, 'post', params)
}

/**
 * 结算单列表
 */
export function getSettleList (params) {
  return API(api.getSettleList, 'post', {}, params)
}
/**
 * 添加结算单list
 */
export function waybillPageWithFee (params) {
  return API(api.waybillPageWithFee, 'post', params)
}
/**
 * 结算单调整添加
 */
export function addWaybillList (params) {
  return API(api.addWaybillList, 'post', {}, params)
}
/**
 * 删除结算单
 */
export function deleteSettle (params) {
  return API(api.deleteSettle, 'get', params)
}
/**
 * 提交结算单
 */
export function commitSettle (params) {
  return API(api.commitSettle, 'get', params)
}
/**
 * 新增客户结算单
 */
export function addSettlement (params) {
  return API(api.addSettlement, 'post', {}, params)
}
/**
 * 更新结算单
 */
export function updataSettlement (params) {
  return API(api.updataSettlement, 'post', {}, params)
}
/**
 * 协同运单list
 */
export function reqCoordinateList (params) {
  return API(api.reqCoordinateList, 'post', {}, params)
}
/**
 * 更新协同状态list
 */
export function updateCoordinateList (params) {
  return API(api.updateCoordinateList, 'post', {}, params)
}
/**
 * 对账单详情
 */
export function checkCoordinateDetail (params) {
  return API(api.checkCoordinateDetail, 'get', params)
}
/**
 * 调差
 */
export function adjustDocument (params) {
  return API(api.adjustDocument, 'post', {}, params)
}

/**
 * 退回结算单
 */
export function returnSettlement (params) {
  return API(api.returnSettlement, 'get', params)
}

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
// 费用类型
export function costTypeInput (params) {
  return API(api.costType, 'get', params)
}
/**
 * 出纳确认
 */
export function enterSettlement (params) {
  return API(api.enterSettlement, 'post', params)
}
/**
 * 出纳删除
 */
export function delSettlement (params) {
  return API(api.delSettlement, 'get', params)
}
