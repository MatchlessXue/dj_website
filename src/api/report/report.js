import API from './API'
const api = {
  getStatisticObjectList: '/statictis/object/list', // 运营统计报表-统计对象列表
  getDisplayDimensionsList: '/statictis/show/list', // 运营统计报表-展示维度列表
  getStatisticTimeList: '/statictis/time/list', // 运营统计报表-统计时间列表
  getProfitList: '/profit', // 利润分析报表 列表
  getOperationStatisticList: '/statictis', // 运营分析报表 列表
  exportProfitList: '/exportProfit', // 导出利润报表数据
  getIncomeOutcomeData: '/income/list', // 收支报表
  getRoadLineStatData: '/route/list', // 线路统计
  getAbnormalStatData: '/unusual/list', // 异常统计
  getWaybillStatData: '/waybill/list' // 运单统计
}

export default api

/**
 * 收支报表
 * @param {*} params
 */
export function getIncomeOutcomeData (params) {
  return API(api.getIncomeOutcomeData, 'get', params)
}

/**
 * 线路统计
 * @param {*} params
 */
export function getRoadLineStatData (params) {
  return API(api.getRoadLineStatData, 'get', params)
}

/**
 * 异常统计
 * @param {*} params
 */
export function getAbnormalStatData (params) {
  return API(api.getAbnormalStatData, 'get', params)
}

/**
 * 运单统计
 * @param {*} params
 */
export function getWaybillStatData (params) {
  return API(api.getWaybillStatData, 'get', params)
}

/**
 * 利润分析报表-导出利润报表数据
 * @param {*} params
 */
export function exportProfitList (params) {
  return API(api.exportProfitList, 'get', params)
}

/**
 * 利润分析报表-列表
 * @param {*} params
 */
export function getProfitList (params) {
  return API(api.getProfitList, 'post', params)
}

/**
 * 运营分析报表-列表
 * @param {*} params
 */
export function getOperationStatisticList (params) {
  return API(api.getOperationStatisticList, 'post', params)
}

/**
 * 运营统计报表-统计对象列表
 * @param {*} params
 */
export function getStatisticObjectList (params) {
  return API(api.getStatisticObjectList, 'get', params)
}

/**
 * 运营统计报表-展示维度列表
 * @param {*} params
 */
export function getDisplayDimensionsList (params) {
  return API(api.getDisplayDimensionsList, 'get', params)
}

/**
 * 运营统计报表-统计时间列表
 * @param {*} params
 */
export function getStatisticTimeList (params) {
  return API(api.getStatisticTimeList, 'get', params)
}
