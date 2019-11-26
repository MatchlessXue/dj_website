import API from './API'

const api = {
  queryCargos: '/cargo/getPage', // 查询列表
  saveCargo: '/cargo/save', // 新增修改
  getCargoById: '/cargo/detail', // 根据Id获取页面信息 cargoId
  deleteCargoById: '/cargo/delete', // 根据Id删除货物
  simpleList: '/cargo/simpleList' // 获取所有货物信息
}

export default api

/**
 * 查询列表
 * @param {*} params
 */
export function queryCargos (params) {
  return API(api.queryCargos, 'post', params)
}

/**
 * 新增修改
 * @param {*} params
 */
export function saveCargo (params) {
  return API(api.saveCargo, 'post', {}, params)
}

/**
 * 根据Id获取页面信息
 * @param {*} params
 */
export function getCargoById (params) {
  return API(api.getCargoById, 'get', params)
}

/**
 * 新增修改
 * @param {*} params
 */
export function deleteCargoById (params) {
  return API(api.deleteCargoById, 'get', params)
}

/**
 * 获取所有货物信息
 * @param {*} params
 */
export function simpleList (params) {
  return API(api.simpleList, 'get', params)
}
