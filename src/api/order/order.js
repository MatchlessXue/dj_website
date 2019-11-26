import API from './API'

const api = {
  selectByPage: '/order/selectByPage', // 查询订单分页信息
  orderDelete: '/order/delete', // 删除订单
  orderDetail: '/order/detail', // 订单详情页
  addOrder: '/order/addorupd' // 订单详情页
}

export default api

/**
 * 查询列表
 * @param {*} params
 */
export function orderSelectByPage (params) {
  return API(api.selectByPage, 'post', params)
}

/**
 * 删除列表
 * @param {*} params
 */
export function orderDelete (params) {
  return API(api.orderDelete, 'delete', params)
}

/**
 * 订单详情页
 * @param {*} params
 */
export function orderDetail (params) {
  return API(api.orderDetail, 'post', params)
}

/**
 * 新增订单
 * @param {*} params
 */
export function addOrder (params) {
  return API(api.addOrder, 'post', {}, params)
}
