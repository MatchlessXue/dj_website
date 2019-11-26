import API from './API'
const api = {
  getTemplateBase: '/import/getTemplateBase', // 取得导入基本参数
  readExcelFile: '/import/readExcelFile', // 取得excel文件表结构信息
  getTemplateList: '/template/getTemplateList', // 根据用户查询模板列表
  getTemplateMapByTempId: '/templateMap/getTemplateMapByTempId', // 根据模板ID查询详情
  dataImport: '/import/dataimport', // 导入数据[通用]
  templateSave: '/template/save', // template新增/修改
  importHistory: '/importHistory/page' // 导入历史
}

export default api

/**
 * 取得导入基本参数
 * @param {*} params
 */
export function getTemplateBase (params) {
  return API(api.getTemplateBase, 'get', params)
}

/**
 * 取得excel文件表结构信息
 * @param {*} params
 */
export function readExcelFile (params, data) {
  return API(api.readExcelFile, 'post', params, data)
}

/**
 * 根据用户查询模板列表
 * @param {*} params
 */
export function getTemplateList (params) {
  return API(api.getTemplateList, 'post', params)
}

/**
 * 根据模板ID查询详情
 * @param {*} params
 */
export function getTemplateMapByTempId (params) {
  return API(api.getTemplateMapByTempId, 'post', params)
}

/**
 * 导入数据[通用]
 * @param {*} params
 */
export function dataImport (params, data) {
  return API(api.dataImport, 'post', params, data)
}

/**
 * template新增/修改
 * @param {*} params
 */
export function templateSave (params) {
  return API(api.templateSave, 'post', {}, params)
}

/**
 * 根据模板ID查询详情
 * @param {*} params
 */
export function importHistory (params) {
  return API(api.importHistory, 'post', params)
}
