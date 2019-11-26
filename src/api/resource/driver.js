import API from './API'

const api = {
  queryDrivers: '/driver/getPage', // 查询列表
  saveDrivers: '/driver/saveOrUpdate', // 新增修改
  getDriverById: '/driver/detail/', // 根据Id获取页面信息 driverId
  setDriversStatus: '/driver/setStatus', // 修改状态：启用，停用
  deleteDriver: '/driver/delete', // 删除
  queryAllDrivers: '/driver/getList' // 查看司机信息列表<不分页>
}

export default api

/**
 * 查询列表
 * @param {*} params
 */
export function getAllDrivers (params) {
  return API(api.queryAllDrivers, 'post', params)
}

/**
 * 查询列表（分页版）
 * @param {*} params
 */
export function queryDrivers (params) {
  return API(api.queryDrivers, 'post', params)
}

/**
 * 新增修改
 * @param {*} params
 */
export function saveDrivers (params) {
  return API(api.saveDrivers, 'post', {}, params)
}

/**
 * 根据Id获取页面信息
 * @param {*} params
 */
export function getDriverById (params) {
  return API(`${api.getDriverById}${params.driverId}`, 'post')
}

/**
 * 修改状态：启用，停用
 * @param {*} params
 */
export function setDriversStatus (params) {
  return API(api.setDriversStatus, 'get', params)
}

/**
 * 删除
 * @param {*} params
 */
export function deleteDriver (params) {
  return API(`${api.deleteDriver}`, 'get', params)
}
