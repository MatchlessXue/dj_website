import API from './API'

const api = {
  querylist: '/contract/getPage', // 获取合同列表
  approvelist: '/contract/approve/list', // 审批状态列表
  vaildlist: '/contract/vaild/list', // 合同状态列表
  detail: '/contract/detail', // 查看合同详情
  delete: '/contract/delete', // 删除合同
  save: '/contract/saveOrUpdate', // 新增/修改合同
  updatestatus: '/contract/setStatus', // 更新状态 100:启用 101:停用
  getAllContractList: '/contract/get/list', // 合同查询合同列表，无分页
  matchprice: '/contract/match/matchWaybill', // 订单匹配合同计算价格
  matchDispatch: '/contract/match/matchDispatch', // 调度单匹配合同计算价格
  queryContractRouteList: '/contractRoutePrice/queryList/', // 获取合同下线路列表
  getContractRoutePrice: '/contractRoutePrice/getPage/', // 获取分页线路列表
  saveOrUpdateContractRoute: '/contractRoutePrice/saveOrUpdate', // 新增或修改合同线路
  querySingleContractRoute: '/contractRoutePrice/getSingleRoute/',
  deleteContractRoute: '/contractRoutePrice/delete' // 删除一条合同线路
}

export default api

/**
 * 新增或修改合同线路
 * @param {*} data
 */
export function saveOrUpdateContractRoute (data) {
  return API(api.saveOrUpdateContractRoute, 'post', {}, data)
}

/**
 * 获取分页线路列表
 * @param {*} data
 */
export function getContractRoutePrice (param) {
  return API(api.getContractRoutePrice, 'post', param)
}

/**
 * 获取合同下线路列表
 * @param {*} data
 */
export function getContractRouteList (param) {
  return API(`${api.queryContractRouteList}${param.contractId}`, 'get', param)
}

/**
 * 获取合同下指定线路
 * @param {*} data
 */
export function getSingleContractRoute (param) {
  return API(`${api.querySingleContractRoute}${param.regionKey}`, 'get', param)
}

/**
 * 分页获取合同列表
 * @param {*} data
 */
export function querylist (data) {
  return API(api.querylist, 'post', data)
}

/**
 * 审批状态列表
 */
export function approvelist () {
  return API(api.approvelist, 'get')
}

/**
 * 合同状态列表
 */
export function vaildlist () {
  return API(api.vaildlist, 'get')
}
/**
 * 查看合同详情
 * @param {*} params
 */
export function contractdetail (params) {
  return API(api.detail + '/' + params.contractId, 'get', params)
}

/**
 * 删除合同
 * @param {*} params
 */
export function contractdelete (params) {
  return API(api.delete, 'get', params)
}

/**
 * 删除合同线路
 * @param {*} params
 */
export function deleteContractRoute (params) {
  return API(`${api.deleteContractRoute}`, 'get', params)
}

/**
 * 新增/修改合同
 * @param {*} params
 */
export function contractsave (data) {
  return API(api.save, 'post', {}, data)
}

/**
 * 更新状态
 * @param {*} params
 */
export function updatestatus (params) {
  return API(api.updatestatus, 'get', params)
}

/**
 * 合同查询合同列表，无分页
 * @param {*} params
 */
export function getAllContractList (params) {
  return API(api.getAllContractList, 'get', params)
}

/**
 * 订单匹配合同计算价格
 * @param {*} data
 */
export function getmatchprice (data) {
  return API(api.matchprice, 'post', {}, data)
}
/**
 * 调度单匹配合同计算价格
 * @param {*} data
 */
export function matchDispatch (data) {
  return API(api.matchDispatch, 'post', {}, data)
}
