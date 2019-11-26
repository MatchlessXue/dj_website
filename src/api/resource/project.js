import API from './API'

const api = {
  list: '/project/list', // 获取所有project信息
  getListByTenantId: '/project/page', // 获取所有project信息
  ProjectSave: '/project/save', // 新建项目
  setStatus: '/project/setStatus' // 项目状态停用启用
}

export default api

/**
 * 查询所有project
 * @param {*} params
 */
export function getProjectList (params) {
  const url = `${api.list}`
  return API(url, 'post', params)
}
/**
 * 查询列表
 * @param {*} params
 */
export function getListByTenantId (params) {
  return API(api.getListByTenantId, 'post', params)
}
/**
 * 新建项目
 * @param {*} params
 */
export function ProjectSave (data) {
  return API(api.ProjectSave, 'post', {}, data)
}
/**
 * 更改项目状态
 * @param {*} params
 */
export function setStatus (params) {
  return API(api.setStatus, 'get', params)
}
