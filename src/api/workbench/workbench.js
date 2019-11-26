import API from './API'
const api = {
  getStatisticData: '/reposts' // 获取 工作台调度状态统计
}

export default api

/**
 * 获取 工作台调度状态统计数据
 * @param {*} params
 */
export function getStatisticData (params) {
  return API(api.getStatisticData, 'get', params)
}
