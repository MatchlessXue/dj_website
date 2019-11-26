import API from '../order/API'

const api = {
  selectByPage: '/waybill/selectByPage', // 查询运单分页信息
  waybillDelete: '/waybill/delete', // 删除运单
  waybillDetail: '/waybill/detail', // 运单详情页
  addwaybill: '/waybill/addorupd', // 保存运单详情
  beforeSave: '/waybill/beforeSave', // 提交前校验
  getCostCheckList: '/waybill/selectByPageWithSummary', // 分页获取运单信息(费用盘点)
  getOrderPrice: '/contract/match/matchWaybill', // 获取价格匹配合同
  waybillActive: '/waybill/waybillActive', // 运单调度
  settleSummary: '/settle/settleSummary' // 运单结算-费用列表
}

export default api

/**
 * 查询列表
 * @param {*} params
 */
export function waybillSelectByPage (params) {
  return API(api.selectByPage, 'post', params)
}

/**
 * 删除列表
 * @param {*} params
 */
export function waybillDelete (params) {
  return API(api.waybillDelete, 'delete', params)
}

/**
 * 运单详情页
 * @param {*} params
 */
export function waybillDetail (params) {
  return API(api.waybillDetail, 'post', params)
}

/**
 * 新增运单
 * @param {*} params
 */
export function addwaybill (params) {
  return API(api.addwaybill, 'post', {}, params)
}

/**
 * 提交前校验
 * @param {*} params
 */
export function waybillbeforeSave (params) {
  return API(api.beforeSave, 'post', {}, params)
}

/**
 * 分页获取运单信息(费用盘点)
 * @param {*} params
 */
export function waybillGetCostCheckList (params) {
  return API(api.getCostCheckList, 'post', params)
}

/**
 * 订单获取价格匹配
 * @param {*} params
 */
export function getOrderPrice (params) {
  return API(api.getOrderPrice, 'post', {}, params)
}

/**
 * 运单调度
 * @param {*} params
 */
export function waybillActive (params) {
  return API(api.waybillActive, 'post', params)
}

/**
 * 运单结算-费用列表
 * @param {*} params
 */
export function settleSummary (params) {
  return API(api.settleSummary, 'post', params)
}
