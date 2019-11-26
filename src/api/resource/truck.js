import API from './API'

const api = {
  queryTrucks: '/truck/query-trucks/', // 查询列表
  queryAllTrucks: '/truck/selectAll', // 查出所有车辆
  queryAllTruckDrivers: '/truck/query/getByPlateNumber', // 查出所有车辆(含司机信息)
  saveTrucks: '/truck/save', // 新增修改
  getTruckById: '/truck/detail/', // 根据Id获取页面信息 truckId
  setTruckStatus: '/truck/update-truck-status', // 修改状态：启用，停用
  deleteTruck: '/truck/' // truckId
}

export default api

/**
 * 查询列表
 * @param {*} params
 */
export function queryTrucks (params) {
  return API(api.queryTrucks, 'post', {}, params)
}
/**
 * 查出所有车辆
 * @param {*} params
 */
export function queryAllTrucks (params) {
  return API(api.queryAllTrucks, 'post', {}, params)
}
export function queryAllTruckDrivers (params) {
  return API(api.queryAllTruckDrivers, 'get', params)
}

/**
 * 新增修改
 * @param {*} params
 */
export function saveTrucks (params) {
  return API(api.saveTrucks, 'post', {}, params)
}

/**
 * 根据Id获取页面信息
 * @param {*} params
 */
export function getTruckById (params) {
  return API(`${api.getTruckById}${params.truckId}`, 'get')
}

/**
 * 修改状态：启用，停用
 * @param {*} params
 */
export function setTruckStatus (params) {
  return API(api.setTruckStatus, 'post', params)
}

export function deleteTruck (params) {
  return API(`${api.deleteTruck}${params.truckId}`, 'get', params)
}

export function uploadPicture (params) {
  return API(api.uploadPicture, 'post', params)
}

export function getStatus (params) {
  return API(api.getStatus, 'get', params)
}
