import API from './API'

const api = {
  getApproveSetupItemList: '/approve/getModelListByTypeId', // 获取审批设置项列表
  toggleBizStatus: '/approve/operaModelByModelId', // 切换业务启停状态
  setOperator: '/approve/setOperator' // 设置审批人或抄送人
}

export function setOperator (params) {
  return API(api.setOperator, 'post', {}, params)
}

export function toggleBizStatus (params) {
  return API(api.toggleBizStatus, 'get', params)
}

export function getApproveSetupItemList (params) {
  return API(api.getApproveSetupItemList, 'get', params)
}

export default api
