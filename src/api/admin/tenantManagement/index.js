import API from './API'
const api = {
  selectByPage: '/libraries/expense/selectByPage', // 租户列表分页
  gettenantall: '/platform/print/gettenantall', // 租户列表模糊查询
  // gettenantall: '/libraries/expense/gettenantall', // 租户列表模糊查询
  tenantexpense: '/libraries/tenantexpense/list', // 租户下面的项目、承运商、司机列表对应的费用设置列表
  feepartnerList: '/datum/partner/getPlatformPage', // 租户下面的项目、承运商列表 -- 后台
  feepartnerList2: '/datum/partner/getCustomPage', // 租户下面的项目、承运商列表 --系统
  feeCheck: '/libraries/tenantexpense/check' // 费用勾选

}

export default api

/**
 * 查询列表
 * @param {*} params
 */
export function selectByPage (params) {
  return API(api.selectByPage, 'post', params)
}
export function gettenantall (params) {
  return API(api.gettenantall, 'post', params)
}
/**
 *费用列表
 *  */
export function tenantexpense (params) {
  return API(api.tenantexpense, 'post', {}, params)
}

/**
 * 查询租户下的客户承运商列表 -- 后台
 * @param {*} params
 */
export function feepartnerList (params) {
  return API(api.feepartnerList, 'post', params)
}

/**
 * 查询租户下的客户承运商列表 --系统
 * @param {*} params
 */
export function feepartnerList2 (params) {
  return API(api.feepartnerList2, 'post', params)
}

/**
 *费用列表
 *  */
export function feeCheck (params) {
  return API(api.feeCheck, 'post', {}, params)
}
