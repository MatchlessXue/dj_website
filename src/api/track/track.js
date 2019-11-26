import API from './API'

const api = {
  costType: '/trackExpense/getExpenseType', // 费用类型
  exceptionType: '/spinner/exceptionType', // 异常类型
  settlementObject: '/spinner/settlementObject', // 结算对象
  settlementStyle: '/spinner/settlementStyle', // 结算方式
  transportationLink: '/spinner/transportationLink', // 运输环节
  waybillStatus: '/spinner/waybillStatus', // 运单状态
  dispatchBizStatus: '/spinner/dispatchBizStatus', // 调度单状态
  specialFeeOrClaimProcessStatus: '/spinner/getTrackHandleType', // 获取特殊费或索赔赔偿处理状态
  receiptList1: '/waybill/track/selectByPage', // 运单跟踪列表
  receiptList2: '/dispatchTrack/selectByPage', // 调度单跟踪列表
  trackExpense: '/trackExpense/selectByPage', // 特殊费列表
  trackException: '/trackException/selectByPage', // 异常列表
  batchDelivery: '/waybill/track/batchDelivery', // 运单批量提货
  batchArrival: '/waybill/track/batchArrival', // 运单批量送达
  getExpenseType: '/trackExpense/getExpenseType', // 获得当前租户特殊费费用类型
  addTrackExpense: '/trackExpense/addTrackExpense', // 添加在途跟踪特殊费
  saveExpense: '/dispatchTrack/saveExpense', // 添加调度单跟踪特殊费
  addTrackException: '/trackException/addTrackException', // 添加在途跟踪报异常
  feedback: '/track/node/feedback', // 在途反馈
  conductAffairs: '/trackExpense/conductAffairs', // 处理特殊费用
  handlingException: '/trackException/handlingException', // 处理异常信息
  getExpenseInfo: '/trackException/getExpenseInfo', // 获取异常信息详情
  dispatchTrackWaybill: '/dispatchTrack/waybill', // 调度单跟踪  ----  获取分摊详情
  dispatchTrackExpense: '/dispatchTrack/trackExpense', // 调度单跟踪  ----    获取特殊费信息
  dispatchTrackException: '/dispatchTrack/trackException', // 调度单跟踪  ----  异常 -- 历史异常信息
  dispatchTrackNodes: '/dispatchTrack/nodes', // 调度单跟踪 --- 在途  -- 获取历史在途信息
  waybillTrackNodes: '/track/node/getAddressList', // 运单跟踪 --- 在途  -- 获取历史在途信息
  dispatchTrackConfirmGoods: '/dispatchTrack/confirmGoods', // 调度单跟踪 --- 确认提货/签收

  getSettlementObject2: '/trackException/object/list', // new获取结算对象,
  getExpense: '/trackException/getExpenseType', // 获取赔偿索赔费类型,
  getCalian: '/trackExpense/expense/page', // 获取赔偿索赔费列表,

  getSettlementObject: '/trackExpense/getSettlementObject', // 获取结算对象,
  queryDispatchTrackNodes: '/track/node/getAddressList', // 获取在途节点信息
  getExpenseList: '/trackExpense/expense/page', // 赔偿费索赔费列表
  trackExpenseCommit: '/trackExpense/commit', // 特殊费用提交处理
  trackExpenseDelete: '/trackExpense/delete', // 特殊费用删除处理
  checkWaybillDispatchRel: '/waybill/track/checkWaybillDispatchRel',
  getTrackDetail: '/trackExpense/getExpenseInfo' // 获取特殊费/索赔/赔偿详情
}

export default api

// 获取特殊费/索赔/赔偿详情
export function getTrackBusinessFeeDetail (params) {
  return API(api.getTrackDetail, 'post', params)
}

// 获取在途节点信息
export function checkWaybillDispatchRel (params) {
  return API(api.checkWaybillDispatchRel, 'get', params)
}

//  获取特殊费或索赔赔偿处理状态
export function getSpecialFeeOrClaimProcessStatus (params) {
  return API(api.specialFeeOrClaimProcessStatus, 'get', params)
}

// 获取历史异常信息列表 -- 运单跟踪
export function getHistoryExceptionList (params) {
  return API(api.trackException, 'post', params)
}

// 获取在途节点信息
export function getDispatchTrackNodes (params) {
  return API(api.queryDispatchTrackNodes, 'get', params)
}

// 运单跟踪列表
export function getReceiptList1 (params) {
  return API(api.receiptList1, 'get', params)
}
// 调度单跟踪列表
export function getReceiptList2 (params) {
  return API(api.receiptList2, 'post', params)
}
// 特殊费列表
export function getTrackSpecialExpenseList (params) {
  return API(api.trackExpense, 'post', params)
}
// 异常列表
export function trackException (params) {
  return API(api.trackException, 'post', params)
}
// 批量提货
export function batchDelivery (params) {
  return API(api.batchDelivery, 'post', params)
}
// 批量送达
export function batchArrival (params) {
  return API(api.batchArrival, 'post', params)
}
// 获得当前租户特殊费费用类型
export function getExpenseType (params) {
  return API(api.getExpenseType, 'post', params)
}
// 添加在途跟踪特殊费
export function addTrackExpense (params) {
  return API(api.addTrackExpense, 'post', {}, params)
}
// 添加调度单跟踪特殊费
export function saveExpense (params) {
  return API(api.saveExpense, 'post', {}, params)
}
// 添加在途跟踪报异常
export function addTrackException (params) {
  return API(api.addTrackException, 'post', params)
}
// 在途反馈
export function feedback (params) {
  return API(api.feedback, 'post', params)
}
// 处理特殊费用
export function conductAffairs (params) {
  return API(api.conductAffairs, 'post', {}, params)
}
// 处理异常信息
export function handlingException (params) {
  return API(api.handlingException, 'post', {}, params)
}
// 获取异常信息详情
export function getExpenseInfo (params) {
  return API(api.getExpenseInfo, 'post', params)
}
// 费用类型
export function costType (params) {
  return API(api.costType, 'post', params)
}
// 异常类型
export function exceptionType (params) {
  return API(api.exceptionType, 'get', params)
}
// 结算对象
export function settlementObject (params) {
  return API(api.settlementObject, 'get', params)
}
// 获取结算对象
export function getSettlementObject (params) {
  return API(api.getSettlementObject, 'post', params)
}

// 结算方式
export function settlementStyle (params) {
  return API(api.settlementStyle, 'get', params)
}
// 运输环节
export function transportationLink (params) {
  return API(api.transportationLink, 'get', params)
}
// 运单状态
export function waybillStatus (params) {
  return API(api.waybillStatus, 'get', params)
}

// 调度单状态
export function dispatchBizStatus (params) {
  return API(api.dispatchBizStatus, 'get', params)
}

// 获取分摊详情  -- 2019年05月01日15:23:05
export function dispatchTrackWaybill (params) {
  return API(api.dispatchTrackWaybill, 'post', params)
}

// 调度单跟踪  ----    获取特殊费信息 2019年05月01日16:45:55
export function dispatchTrackExpense (params) {
  return API(api.dispatchTrackExpense, 'post', params)
}
// 调度单跟踪  ----  异常 -- 历史异常信息  2019年05月01日16:52:43
export function dispatchTrackException (params) {
  return API(api.dispatchTrackException, 'post', params)
}
// '/dispatchTrack/nodes', // 调度单跟踪 --- 在途  -- 获取历史在途信息
export function dispatchTrackNodes (params) {
  return API(api.dispatchTrackNodes, 'post', params)
}
// '/dispatchTrack/nodes', // 调度单跟踪 --- 在途  -- 获取历史在途信息
export function waybillTrackNodes (params) {
  return API(api.waybillTrackNodes, 'get', params)
}
// '/dispatchTrack/confirmGoods' // 调度单跟踪 --- 确认提货/签收
export function dispatchTrackConfirmGoods (params) {
  return API(api.dispatchTrackConfirmGoods, 'post', params)
}
export function getSettlementObject2 (params) {
  return API(api.getSettlementObject2, 'get', params)
}
export function getExpense (params) {
  return API(api.getExpense, 'post', params)
}
export function getCalian (params) {
  return API(api.getExpense, 'post', params)
}
export function getExpenseList (params) {
  return API(api.getExpenseList, 'get', params)
}
export function trackExpenseCommit (url) {
  return API(api.trackExpenseCommit + url, 'post')
}
export function trackExpenseDelete (url) {
  console.log(api.trackExpenseDelete + url)
  return API(api.trackExpenseDelete + url, 'delete', {})
}
