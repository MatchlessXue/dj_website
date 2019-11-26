import API from './API'

const api = {
  selectByPage: '/siteAddress/selectByPage', // 查询列表
  selectAll: '/siteAddress/selectAll', // 查询列表
  selectTransferAll: '/siteAddress/selectTransferAll', // 查询调度列表
  saveSiteAddress: '/siteAddress/addorupd', // 新增修改
  getSiteAddressById: '/siteAddress/detail', // 根据Id获取页面信息
  getStatus: '/siteAddress/status', // 中转站筛选
  getAllNames: '/siteAddress/getAllNames', // 获取所有收发货名称列表
  deleteSiteAddress: '/siteAddress/delete' // 删除
}

export default api

/**
 * 查询列表
 * @param {*} params
 */
export function selectByPage (params) {
  return API(api.selectByPage, 'post', params)
}
/**
 * 查询所有站点
 * @param {*} params
 */
export function selectAll (params) {
  return API(api.selectAll, 'post', params)
}
/**
 * 查询调度所有站点
 * @param {*} params
 */
export function selectTransferAll (params) {
  return API(api.selectTransferAll, 'post', params)
}

/**
 * 新增修改
 * @param {*} params
 */
export function saveSiteAddress (params) {
  return API(api.saveSiteAddress, 'post', {}, params)
}
/**
 * 根据Id获取页面信息
 * @param {*} params
 */
export function getSiteAddressById (params) {
  return API(api.getSiteAddressById, 'post', params)
}
/**
 * 删除
 * @param {*} params
 */
export function deleteSiteAddress (params) {
  return API(api.deleteSiteAddress, 'get', params)
}
/**
 * 中转站筛选
 * @param {*} params
 */
export function getStatus (params) {
  return API(api.getStatus, 'get', params)
}
export function getAllSiteName (params) {
  return API(api.getAllNames, 'post', params)
}
