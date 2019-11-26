import API from './API'

const api = {
  gettenantall: '/print/gettenantall', // 获取租户
  getprinttemplate: '/print/getprinttemplate', // 获取模板列表
  getprintparam: '/print/getprintparam', // 获取打印参数
  getprintmenu: '/print/getprintmenu', // 获取所属菜单
  addprinttemplate: '/print/addprinttemplate', // 新增/修改模板
  addprintparam: '/print/addprintparam', // 添加打印参数
  deleteByIds: '/print/deleteByIds', // 根据模板id删除
  getprinttemplateDetails: '/print/getprinttemplateDetails', // 获取模板详情
  addprintrecord: '/print/addprintrecord' // 新增打印记录

}
export function addprintrecord (params) {
  return API(api.addprintrecord, 'post', {}, params)
}
export function getprinttemplateDetails (params) {
  return API(api.getprinttemplateDetails, 'post', params)
}
export function gettenantall (params) {
  return API(api.gettenantall, 'post', params)
}
export function getprinttemplate (params) {
  return API(api.getprinttemplate, 'post', params)
}
export function getprintparam (params) {
  return API(api.getprintparam, 'post', params)
}
export function getprintmenu (params) {
  return API(api.getprintmenu, 'post', params)
}
export function addprinttemplate (params) {
  return API(api.addprinttemplate, 'post', {}, params)
}
export function addprintparam (params) {
  return API(api.addprintparam, 'post', params)
}
export function deleteByIds (params) {
  return API(api.deleteByIds, 'post', params)
}

export default api
