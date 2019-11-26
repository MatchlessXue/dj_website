import API from './API'
// import axios from '@/utils/request'
// import qs from 'qs'
const api = {
  selectByPage: '/selectByPage', // 查询调度单分页信息
  dispatchDelete: '/delete', // 删除订单
  dispatchDetail: '/detail', // 调度单详情页
  dispatchAllStatus: '/dispatchidstatus', // 获取所有调度单状态
  deleteDispatchById: '/deleteById', // 根据调度单id删除调度单
  lookdriver: '/lookdriver', // 找司机
  dispatchNotice: '/notice', // 一键通知
  lineList: '/gxlist', // 干线调度列表
  deliveryList: '/pslist', // 配送调度列表
  goodsList: '/lines', // 提货调度列表
  getGoodsByCode: '/getconsignment', // 根据运单id数组获取货物详情
  createDispatchWaybill: '/generate', // 生成调度单
  linereturn: '/linereturn', // 路线列表 退回功能
  getdetails: '/getdetails' // 调度单详情
}

export default api

/**
 * 找司机
 * @param {*} params
 */
export function lookdriver (params) {
  return API(api.lookdriver, 'post', params)
}

/**
 * 根据调度单id删除调度单
 * @param {*} params
 */
export function deleteDispatchById (params) {
  return API(api.deleteDispatchById, 'post', params)
}

/**
 * 获取调度单所有状态
 * @param {*} params
 */
export function getAllDispatchStatus (params) {
  return API(api.dispatchAllStatus, 'post', params)
}

/**
 * 一键通知
 * @param {*} params
 */
export function oneKeyNotify (params) {
  return API(api.dispatchNotice, 'post', params)

/**
qs.stringify({ a: [1, 2, 3 ] }, { arrayFormat: 'indices' });
//  'a[0]=1&a[1]=2&a[2]=3'

qs.stringify( { a: [1, 2, 3 ]} , { arrayFormat: 'brackets' });
//  'a[]=1&a[]=2&a[]=3'

qs.stringify( {a: [1, 2, 3 ]}, { arrayFormat: 'repeat' } );
//  'a=1&a=2&a=3'
 */
}

/**
 * 查询列表
 * @param {*} params
 */
export function dispatchSelectByPage (params) {
  return API(api.selectByPage, 'post', params)
}

/**
 * 删除列表
 * @param {*} params
 */
export function dispatchDelete (params) {
  return API(api.dispatchDelete, 'delete', params)
}

/**
 * 订单详情页
 * @param {*} params
 */
export function dispatchDetail (params) {
  return API(api.dispatchDetail, 'post', params)
}

/**
 * 提货调度列表
 * @param {*} params
 */
export function goodsList (params) {
  return API(api.goodsList, 'post', params)
}

/**
 * 干线调度列表
 * @param {*} params
 */
export function lineList (params) {
  return API(api.lineList, 'post', params)
}

/**
 * 配送调度列表
 * @param {*} params
 */
export function deliveryList (params) {
  return API(api.deliveryList, 'post', params)
}

/**
 * 根据运单id数组获取货物详情
 * @param {*} params
 */
export function getGoodsByCode (params) {
  return API(api.getGoodsByCode, 'post', params)
}

/**
 * 生成调度单
 * @param {*} params
 */
export function createDispatchWaybill (params) {
  return API(api.createDispatchWaybill, 'post', {}, params)
}
/**
 * 路线列表 退回功能
 * @param {*} params
 */
export function linereturn (params) {
  return API(api.linereturn, 'post', params)
}
/**
 * 获取调度单
 * @param {*} params
 */
export function getdetails (params) {
  return API(api.getdetails, 'post', params)
}
