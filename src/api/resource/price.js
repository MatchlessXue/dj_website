// 价格文件
import API from './API'

const api = {
  // 价格文件
  getPriceList: '/contractTerm/getPage', // 分页获取所有价格文件信息
  savePrice: '/contractTerm/save', // 查询列表
  deletePrice: '/contractTerm/delete', // 价格文件删除
  getPriceTypes: '/contractTerm/getPriceType', // 价格文件-价格类型列表
  getPriceFileDetail: '/contractTerm/getPriceFileDetail', // 价格文件页面明细
  // 合同线路价格
  deleteContractRoute: '/contractRoute/delete', // 合同路线删除GET
  getContractRouteDetail: '/contractRoute/getDetail', // 线路及费用-编辑/详情POST
  getContractRouteList: '/contractRoute/getList', // 获取所有合同路线信息 POST
  getContractRoutePage: '/contractRoute/getPage', // 分页获取所有合同路线信息 GET
  getContractRoutePriceType: '/contractRoute/getPriceType', // 合同路线-路线价格类型 GET
  getContractRouteScopeType: '/contractRoute/getScopeType', // 合同路线-区间类型 POST
  saveContractRoute: '/contractRoute/save' // 合同路线新增/修改 POST
}

export default api

/**
 * 查询列表
 * @param {*} params
 */
export function getPriceList (params) {
  return API(api.getPriceList, 'post', params)
}
// 查询列表
export function savePrice (params) {
  return API(api.savePrice, 'post', {}, params)
}
// 价格文件删除
export function deletePrice (params) {
  return API(api.deletePrice, 'get', params)
}
// 价格文件-价格类型列表
export function getPriceTypes (params) {
  return API(api.getPriceTypes, 'get', params)
}
// 价格文件页面明细
export function getPriceFileDetail (params) {
  return API(api.getPriceFileDetail, 'get', params)
}

// 合同路线删除delete
export function deleteContractRoute (params) {
  return API(api.deleteContractRoute, 'get', params)
}
// 线路及费用-编辑/详情
export function getContractRouteDetail (params) {
  return API(api.getContractRouteDetail, 'get', params)
}
// 获取所有合同路线信息 POST
export function getContractRouteList (params) {
  return API(api.getContractRouteList, 'post', params)
}
// 分页获取所有合同路线信息 POST
export function getContractRoutePage (params) {
  return API(api.getContractRoutePage, 'post', params)
}
// 合同路线-路线价格类型 GET
export function getContractRoutePriceType (params) {
  return API(api.getContractRoutePriceType, 'get', params)
}
// 合同路线-区间类型
export function getContractRouteScopeType (params) {
  return API(api.getContractRouteScopeType, 'get', params)
}
// 合同路线新增/修改 POST
export function saveContractRoute (params) {
  return API(api.saveContractRoute, 'post', {}, params)
}
