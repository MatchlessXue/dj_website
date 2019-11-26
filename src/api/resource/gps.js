import API from './API'

const api = {
  addorupd: '/gpsDevice/addorupd', // GPS设备新增/修改
  updateStatus: '/gpsDevice/updateStatus', // GPS设备启用/禁用
  delete: '/gpsDevice/delete', // GPS设备删除
  info: '/gpsDevice/info', // 获得GPS设备信息
  selectByPage: '/gpsDevice/selectByPage', // 分页获取所有GPS设备信息
  getAllByPrivilege: '/partner/getAllByPrivilege', // 获取合作伙伴-客户名称列表
  getAllGps: '/gpsDevice/getAlllist' // 不分页获取所有GPS设备
}

export default api

/**
 * 分页获取所有GPS设备信息
 * @param {*} params
 */
export function getGPSList (params) {
  return API(api.selectByPage, 'post', params)
}

/**
 *  GPS设备启用/禁用
 * @param {*} params
 */
export function updateStatus (params) {
  return API(api.updateStatus, 'post', params)
}
/**
 * GPS设备新增/修改
 * @param {*} params
 */
export function addorupd (params) {
  return API(api.addorupd, 'post', {}, params)
}
/**
 *  GPS设备删除
 * @param {*} params
 */
export function deleteBydeviceId (params) {
  return API(api.delete, 'get', params)
}
/**
 * 获得GPS设备信息
 * @param {*} params
 */
export function info (params) {
  return API(api.info, 'post', params)
}
/**
 *  获取合作伙伴-客户名称列表
 * @param {*} params
 */
export function getAllByPrivilege (params) {
  return API(api.getAllByPrivilege, 'post', params)
}
/**
 * 不分页获取所有GPS设备
 * @param {*} params
 */
export function getAllGps (params) {
  return API(api.getAllGps, 'post', {}, params)
}
