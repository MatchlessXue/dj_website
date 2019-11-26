import API from './API'
const api = {
  getExpTmpList: '/export/getExpTmpList', // 查询导出模板列表
  getExpTmpDetailById: '/export/getExpTmpDetailById', // 根据模板id查询模板详情
  saveOrUpdateExpTmp: '/export/saveOrUpdateExpTmp', // 保存或更新模板
  exportWaybillByExpTmpId: '/export/exportWaybillByExpTmpId', // 导出
  getExpTmpSys: '/export/getExpTmpSys' // 查询导出模板列名
}
export default api

/**
 * 取得导入基本参数
 * @param {*} params
 */
export function getExpTmpList (params) {
  return API(api.getExpTmpList, 'get', params)
}

/**
 * 根据模板id查询模板详情
 * @param {*} params
 */
export function getExpTmpDetailById (params) {
  return API(api.getExpTmpDetailById, 'get', params)
}

/**
 * 保存或更新模板
 * @param {*} params
 */
export function saveOrUpdateExpTmp (params) {
  return API(api.saveOrUpdateExpTmp, 'post', {}, params)
}

/**
 * 导出
 * @param {*} params
 */
export function exportWaybillByExpTmpId (params) {
  return API(api.exportWaybillByExpTmpId, 'get', params)
}
/**
 * 查询导出模板列名
 * @param {*} params
 */
export function getExpTmpSys (params) {
  return API(api.getExpTmpSys, 'get', params)
}
