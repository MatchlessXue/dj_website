import API from './API'

const api = {
  getApproveList: '/approve/getApproveList', // 获取审批列表
  getApproveFlowList: '/approve/processNode', // 获取审批流程数据列表
  approvePassOrReject: '/approve/processNext' // 驳回或审批接口
}

export function getApproveFlowList (params) {
  return API(api.getApproveFlowList, 'post', params)
}

export function getApproveList (params) {
  return API(api.getApproveList, 'get', params)
}

export function approvePassOrReject (params) {
  return API(api.approvePassOrReject, 'post', {}, params)
}

export default api
